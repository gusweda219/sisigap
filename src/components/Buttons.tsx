"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Eye,
  LucideFileBarChart,
  Pencil,
  Printer,
  Send,
  Trash2,
} from "lucide-react";
import { sendEmail } from "@/lib/actions";
import { toast } from "sonner";
import { useState } from "react";

export const ViewActionButton = ({ href }: { href: string }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" asChild>
          <Link href={href}>
            <Eye size={14} />
            <span className="sr-only">View</span>
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>View</p>
      </TooltipContent>
    </Tooltip>
  );
};

export const EditActionButton = ({ href }: { href: string }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" asChild>
          <Link href={href}>
            <Pencil size={14} />
            <span className="sr-only">Edit</span>
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Edit</p>
      </TooltipContent>
    </Tooltip>
  );
};

export const PrintActionButton = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon">
          <Printer size={14} />
          <span className="sr-only">Print</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Print</p>
      </TooltipContent>
    </Tooltip>
  );
};

export const RemoveActionButton = ({ onRemove }: { onRemove: () => void }) => {
  return (
    <Tooltip>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <Trash2 size={14} />
              <span className="sr-only">Remove</span>
            </Button>
          </TooltipTrigger>
        </AlertDialogTrigger>
        <AlertDialogContent
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan dan akan menghapus secara
              permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={onRemove}>Lanjutkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <TooltipContent>
        <p>Hapus</p>
      </TooltipContent>
    </Tooltip>
  );
};

export const SendEmailActionButton = ({ id }: { id: number }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <Tooltip>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <Send size={14} />
              <span className="sr-only">Send Email</span>
            </Button>
          </TooltipTrigger>
        </AlertDialogTrigger>
        <AlertDialogContent
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (isProcessing) {
                  toast.error("Slip gaji sedang dikirim. Mohon menunggu.");
                  return;
                }
                setIsProcessing(true);

                const { error } = (await sendEmail(id)) || {};
                if (!error) {
                  toast.success("Kirim email berhasil dilakukan.");
                } else {
                  toast.error(error);
                }

                setIsProcessing(false);
              }}
            >
              Lanjutkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <TooltipContent>
        <p>Send Email</p>
      </TooltipContent>
    </Tooltip>
  );
};

export const ExportExcellActionButton = ({
  onExport,
}: {
  onExport: () => void;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" onClick={onExport}>
          <LucideFileBarChart size={14} />
          <span className="sr-only">Export</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Export</p>
      </TooltipContent>
    </Tooltip>
  );
};
