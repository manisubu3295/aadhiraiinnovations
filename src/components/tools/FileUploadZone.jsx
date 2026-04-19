import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, CheckCircle2, AlertCircle, RotateCcw, Download } from 'lucide-react'

export default function FileUploadZone({
  accept = { 'application/pdf': ['.pdf'] },
  maxSizeMB = 50,
  onFileAccepted = () => {},
  toolLabel = 'Drag and drop your file here or click to upload',
  isProcessing = false,
  result = null,
  error = null,
  onReset = () => {},
  fileName = '',
  fileSize = '',
}) {
  const maxBytes = maxSizeMB * 1024 * 1024

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles && rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0]
        let errorMsg = 'File rejected'

        if (rejection.errors[0]?.code === 'file-too-large') {
          errorMsg = `File exceeds ${maxSizeMB}MB limit`
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          errorMsg = 'Invalid file type. Please check supported formats.'
        }

        return
      }

      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0])
      }
    },
    [onFileAccepted, maxSizeMB]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize: maxBytes,
    maxFiles: 1,
    disabled: isProcessing || !!result,
  })

  if (result) {
    return (
      <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-8 md:p-10 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="h-12 w-12 text-green-600" strokeWidth={1.5} />
        </div>

        <h3 className="text-xl font-semibold text-green-900 mb-2">Conversion Complete!</h3>
        <p className="text-sm text-green-700 mb-6">{result.fileName}</p>

        <a
          href={result.downloadUrl}
          download={result.fileName}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors mb-4"
        >
          <Download className="h-4 w-4" />
          Download File
        </a>

        <div className="mt-6">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-lg border border-green-300 text-green-700 font-medium hover:bg-green-100 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Convert Another
          </button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-8 md:p-10 text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-red-600" strokeWidth={1.5} />
        </div>

        <h3 className="text-xl font-semibold text-red-900 mb-2">Conversion Failed</h3>
        <p className="text-sm text-red-700 mb-6">{error}</p>

        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    )
  }

  if (isProcessing) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 md:p-10 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 border-4 border-slate-200 border-t-[#0B1F3A] rounded-full animate-spin" />
        </div>

        <h3 className="text-lg font-semibold text-[#0B1F3A] mb-2">Processing Your File</h3>
        <p className="text-sm text-slate-600">{fileName}</p>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`rounded-2xl border-2 border-dashed transition-all cursor-pointer p-8 md:p-12 text-center ${
        isDragActive
          ? 'border-[#0B1F3A] bg-[#0B1F3A]/5'
          : 'border-slate-300 hover:border-slate-400 bg-white'
      }`}
    >
      <input {...getInputProps()} />

      <div className="flex justify-center mb-4">
        <Upload
          className={`h-12 w-12 transition-colors ${
            isDragActive ? 'text-[#0B1F3A]' : 'text-slate-400'
          }`}
          strokeWidth={1.5}
        />
      </div>

      <h3 className="text-lg font-semibold text-[#0B1F3A] mb-2">
        {isDragActive ? 'Drop your file here' : toolLabel}
      </h3>

      <p className="text-sm text-slate-500 mb-4">or click to browse your computer</p>

      {fileName && (
        <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
          <p className="text-sm font-medium text-[#0B1F3A]">{fileName}</p>
          {fileSize && <p className="text-xs text-slate-500 mt-1">{fileSize}</p>}
        </div>
      )}

      <p className="text-xs text-slate-400 mt-6">
        Maximum file size: {maxSizeMB}MB
      </p>
    </div>
  )
}
