import React, { useState } from "react";
import { api } from "~/utils/api";
import { UploadButton , UploadDropzone } from "@uploadthing/react"; 
import type { OurFileRouter } from "../server/uploadThing";
import "@uploadthing/react/styles.css";
import Loading from "~/components/Loading";
import LoadError from "~/components/LoadError";

type Props = {
    userId: string;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const InsuranceUploadModal = ({userId, onClose}: Props) => {
    const [showSaveError, setShowSaveError] = useState(false);
    const [showUploadSuccess, setShowUploadSuccess] = useState(false);
    const [showUploadError, setShowUploadError] = useState(false);

    const documentTypeQuery = api.documentType.list.useQuery();
    const documentLogMutation = api.documentLog.create.useMutation();
    const documentLogUpdateMutation = api.documentLog.update.useMutation();
    const documentMutation = api.document.create.useMutation();

    if (documentTypeQuery.isLoading) {
        return <Loading type='Modal' />
    }

    if (documentTypeQuery.isError) {
        return <LoadError type='Modal' />
    }

    const documentTypes = documentTypeQuery.data;

    const insuranceDocumentTypeId = documentTypes.find((d) => d.name === 'Insurance')?.id;

    if (!insuranceDocumentTypeId) {
        return <LoadError type='Modal' />
    }

    const saveFileToDB = async (fileURL: string, fileName: string, fileKey: string, fileSize: number) => {
        // Save to the Document Log
        const documentLog = await documentLogMutation.mutateAsync({
            userId,
            url: fileURL,
            name: fileName,
            key: fileKey,
            size: fileSize,
            action: 'Insurance Upload Success'
        })
        .catch((err) => {
            console.error(err);
            setShowSaveError(true);
            return;
        });

        // Save the Document to the client
        documentMutation.mutateAsync({
            userId,
            url: fileURL,
            name: fileName,
            key: fileKey,
            size: fileSize,
            documentTypeId: insuranceDocumentTypeId,
        })
        .catch((err) => {
            console.error(err);
            setShowSaveError(true);
            if (documentLog?.id) {
                documentLogUpdateMutation.mutateAsync({
                    id: documentLog?.id,
                    action: 'Insurance Upload Failed'
                })
                .catch((err) => {
                    console.error(err);
                    setShowSaveError(true);
                    return;
                });
            }
            return;
        });

        setShowUploadSuccess(true);
        setTimeout(() => {
            setShowUploadSuccess(false);
        }, 5000);
    }

    return (
        <div className="w-full">
            <div className="flex flex-row justify-center mb-2 text-3xl py-2 bg-gradient-to-b from-[#333] to-[#000] text-slate-100 w-full rounded-t-md pb-6">Upload Insurance Documents</div>
            <div className="mt-6">
                <div className="mt-4">
                    <p className="flex justify-center font-medium text-lg">You can use the file selector or the drag and drop loader to upload your insurance documents.</p>
                </div>
                <UploadButton<OurFileRouter>
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                        if (res !== undefined && res.length > 0) {
                            const fileURL = res[0]?.url;
                            const fileName = res[0]?.name;
                            const fileKey = res[0]?.key;
                            const fileSize = res[0]?.size;

                            if (fileURL && fileName && fileKey && fileSize) {
                                saveFileToDB(fileURL, fileName, fileKey, fileSize).catch((err) => console.error(err));
                                return;
                            }
                            
                            // set file import error if we reach here
                            setShowUploadError(true);
                        }
                    }}
                    onUploadError={(error: Error) => {
                        setShowUploadError(true);
                        documentLogMutation.mutate({
                            userId,
                            url: '',
                            name: '',
                            key: '',
                            size: 0,
                            action: 'Insurance Upload Error'
                        });
                        console.error(`ERROR! ${error.message}`);
                    }}
                />
            </div>
            <div>
                <UploadDropzone<OurFileRouter>
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                        if (res !== undefined && res.length > 0) {
                            const fileURL = res[0]?.url;
                            const fileName = res[0]?.name;
                            const fileKey = res[0]?.key;
                            const fileSize = res[0]?.size;

                            if (fileURL && fileName && fileKey && fileSize) {
                                saveFileToDB(fileURL, fileName, fileKey, fileSize).catch((err) => console.error(err));
                                return;
                            }
                            
                            // set file import error if we reach here
                            setShowUploadError(true);
                        }
                    }}
                    onUploadError={(error: Error) => {
                        setShowUploadError(true);
                        documentLogMutation.mutate({
                            userId,
                            url: '',
                            name: '',
                            key: '',
                            size: 0,
                            action: 'Insurance Upload Error'
                        });
                        console.error(`ERROR! ${error.message}`);
                    }}
                />
            </div>
        </div>
    )
}

export default InsuranceUploadModal;