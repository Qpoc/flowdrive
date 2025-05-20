import Auth from "~/repository/modules/auth";
import User from "~/repository/modules/user";
import File from "~/repository/modules/file";
import Trash from "~/repository/modules/trash";
import Folder from "~/repository/modules/folder";
import OnlyOffice from "~/repository/modules/onlyoffice";
import Share from "~/repository/modules/share";

interface apiInstance {
    auth: Auth,
    user: User,
    file: File,
    trash: Trash,
    folder: Folder,
    onlyoffice: OnlyOffice,
    share: Share
}

export default defineNuxtPlugin((nuxtApp) => {
    const modules: apiInstance = {
        auth: new Auth(),
        user: new User(),
        file: new File(),
        trash: new Trash(),
        folder: new Folder(),
        onlyoffice: new OnlyOffice(),
        share: new Share()
    }

    return {
        provide: {
            api: modules
        }
    }
});