import { useCallback, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { Button } from '../ui/button'



type FileUploaderProps = {
    fieldChange: (FILES: File[]) => void;
    mediaUrl: string;
}
const FileUploader = ({fieldChange}:FileUploaderProps) => {
    const [fileUrl, setFileUrl] = useState('')
    const [file, setFile] = useState<File[]>([])


    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setFile(acceptedFiles)
        fieldChange(acceptedFiles)
        setFileUrl(URL.createObjectURL(acceptedFiles[0]))
        console.log(acceptedFiles[0].path)
        
        
    }, [file])
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpeg', '.jpg']
        }

    })
    return (
        <div {...getRootProps()} className='flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer '>
            <input {...getInputProps()} className='cursor-pointer' />
            {
                fileUrl ? (
                    

                    <>
                        
                        <div className='flex flex-1 justify-center w-full p-5 lg:p-10'>
                            <img src={fileUrl} alt="Image"
                                className='file_uploader-img' />
                        </div>
                        <p className='file_uploader-label'>Click or Drag photo to change</p>
                    </>

                ) : (
                    <div className='file_uploader-box'>
                        <img
                            src='/assets/icons/file-upload.svg'
                            alt='Upload File'
                            width={96}
                            height={77}
                        />

                        <h3 className='base-medium mt-6 mb-2 text-light-2'>Drag Photo here</h3>
                        <p className='small-regular text-light-4 mb-6'>PNG,JPEG,JPG</p>

                        <Button className='shad-button_dark_4'>
                            Select from Device
                        </Button>
                    </div>
                )
            }
        </div>
    )
}

export default FileUploader
