import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import { baseQueryWithReauth } from "./auth";
import {File} from '../../interfaces/user.interface'

export const fileApi = createApi({
    reducerPath: 'fileApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['File'],  
    endpoints: build => ({
        uploadFiles: build.mutation<File[], FormData>({
            query: (formData) => ({
                url: 'files/uploadFiles',
                method: 'post',
                body: formData,
            }),
            invalidatesTags: ['File'],
        }),
        deleteFile: build.query<File, string>({
            query: (id) => ({
                url: `files/deleteFile/${id}`,
                method: 'delete',
            }),
            //@ts-ignore
            invalidatesTags: ['File']
        }),
        createFolder: build.mutation<File, {currentFolder: string | null, folderName: string, parentFolderId: string}>({
            query: (folderCreationDto) => ({
                url: `files/createFolder`,
                method: 'post',
                body: folderCreationDto
            }),
            invalidatesTags: ['File']
        }),
        renameFile: build.mutation<File, {newName: string, fileID: string}>({
            query: (renameFileDto) => ({
                url: `files/renameFile`,
                method: 'post',
                body: renameFileDto
            }),
            invalidatesTags: ['File']
        }),
        getCurrentFolder: build.query<File, string>({
            query: (id) => ({
                url: `files/getCurrentFolder`,
                method: 'post',
                body: {fileID: id}
            }),
            providesTags: (result, error, id) => [{ type: 'File', id }],
        }),
        downloadFile: build.query<void, string>({
            query: (id) => ({
                url: `files/downloadFile/${id}`,
            })
        })
    })
})

export const {
    useCreateFolderMutation,
    useLazyDeleteFileQuery,
    useRenameFileMutation,
    useUploadFilesMutation,
    useLazyGetCurrentFolderQuery,
    useLazyDownloadFileQuery
} = fileApi