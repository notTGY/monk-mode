import { useState, useCallback, useEffect } from 'react'
import { UploadCloud, Download } from 'lucide-react'
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useDropzone } from 'react-dropzone'
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Header } from '@/components/header'
import { pixelate } from '@/lib/pixelate'

export default function ImageUploader() {
  const { t } = useTranslation()

  const formSchema = z.object({
    email: z.string().email(t('form.email-error')),
  })

  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  useEffect(() => {
    if (!imageUrl) {
      return
    }
    const image = new Image()
    image.src = imageUrl
    pixelate(image).then(newUrl => {
      setProcessedImage(newUrl)
    })
  }, [imageUrl])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setImageName(file.name)
      const objectUrl = URL.createObjectURL(file)
      setImageUrl(objectUrl)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1
  })

  const handleDownload = (email: string) => {
    if (processedImage && imageName) {
      fetch(`/api/email?v=${email}`)

      const a = document.createElement('a')
      a.href = processedImage
      a.download = imageName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      setIsDialogOpen(false)
      form.reset()
    }
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    handleDownload(values.email)
  }

  return (
  <>
    <Header/>
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-xl">
          {t('card.title')}
        </CardHeader>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'
            }`}
          >
            <input id="image-drop-input" {...getInputProps()} />
            {processedImage ? (
              <img 
                src={processedImage} 
                alt={t('card.image-preview')} 
                className="max-h-[320px] max-w-full w-auto mx-auto mb-4"
              />
            ) : imageUrl ? (
              <img 
                src={imageUrl || "/placeholder.svg"} 
                alt={t('card.image-preview')} 
                className="max-h-[320px] max-w-full w-auto mx-auto mb-4"
              />
            ) : (
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            )}
            <label htmlFor="image-drop-input" className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {isDragActive
                ? t('card.drop.empty')
                : imageUrl
                ? t('card.drop.filled')
                : t('card.drop.error')}
            </label>
          </div>
          {processedImage && (
            <Button 
              className="w-full mt-4" 
              onClick={() => setIsDialogOpen(true)}
            >
              <Download className="mr-2 h-4 w-4" />
              {t('card.button')}
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('form.title')}</DialogTitle>
            <DialogDescription>
              {t('form.subtitle')}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.email')}</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {t('form.submit')}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  </>
  )
}
