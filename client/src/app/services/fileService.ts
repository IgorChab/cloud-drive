import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import { baseQueryWithReauth } from "./auth";
import {File} from '../../interfaces/user.interface'

export const fileApi = createApi({
    reducerPath: 'fileApi',
    baseQuery: baseQueryWithReauth,
    endpoints: build => ({
        uploadFiles: build.mutation<File[], FormData>({
            //@ts-ignore
            query: (formData) => ({
                url: 'files/uploadFiles',
                method: 'post',
                body: formData,
                responseHandler(response) {
                    response.headers.set('content-type', 'multipart/form-data')
                },
            })
        }),
        deleteFile: build.query<void, {id: string}>({
            query: (id) => ({
                url: `files/deleteFile/${id}`,
                method: 'delete',
            })
        }),
        createFolder: build.mutation<File[], {currentFolder: string | null, fileName: string}>({
            query: (folderCreationDto) => ({
                url: `files/createFolder`,
                method: 'post',
                body: folderCreationDto
            })
        }),
        // deleteFolder: build.query<void, {id: string}>({
        //     query: (id) => ({
        //         url: `files/deleteFolder/${id}`,
        //         method: 'delete',
        //     })
        // }),
    })
})

export const {
    useCreateFolderMutation,
    useDeleteFileQuery,
    // useDeleteFolderQuery,
    useUploadFilesMutation
} = fileApi