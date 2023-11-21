type Props = {
    type: 'Page' | 'Modal';
}

const Loading = ({type}: Props) => {
    if (type === 'Page') {
        return <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#333]] to-[#000] text-slate-100 text-4xl animate-pulse">Loading...</div>
    }

    if (type === 'Modal')
        return <div className="flex h-96 w-full flex-col items-center justify-center bg-gradient-to-b from-[#333] to-[#000] rounded-md text-slate-100 text-4xl animate-pulse">Loading...</div>

    return null;
}

export default Loading;