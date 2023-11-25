import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";

export function useAuthorizePage() {
    const {user} = useUser();
    const router = useRouter();
    const userId = user?.id ?? '';
    const userQuery = api.user.findAccountByExternalId.useQuery({ externalId: userId });
    const _user = userQuery.data;
    const userCompanyId = _user?.companyId
    const isAdmin = _user?.userType.name === 'Administrator';
    const routeCompanyId:string = router.query.id as string;

    console.log("externalId", userId)
    console.log("user", _user);
    console.log("routeId", router);
    console.log("isAdmin", isAdmin);

    // User isn't Logged in -> Redirect to Login Page
    if (userId == null) {
        router.push(`/login`).catch((err) => console.error(err));
    }
    
    // User is at wrong company page and not a global admin -> fix the id for them and reload it
    if (!isAdmin && (userCompanyId !== routeCompanyId && userCompanyId)) {
        router.push(router.pathname.replace('[id]',userCompanyId)).catch((err) => console.error(err));
    }

    return;
}