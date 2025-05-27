'use client';
import React from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import { Button } from '../ui/button';
import { toast } from 'sonner';

export default function DeleteDialog({
  id,
  action,
}: {
  id: string;
  action: (id: string) => Promise<{ success: boolean; message: string }>;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      const res = await action(id);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      setIsOpen(false);
      toast.success(res.message);
    });
  };
  return (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogTrigger asChild>
        <Button size={'sm'} variant={'destructive'} className='ml-2'>
          Excluir
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Você tem certeza que deseja excluir?
          </AlertDialogTitle>
          <AlertDialogTitle>
            Esta ação não pode ser desfeita. Você não poderá recuperar depois de
            excluído.
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button
            disabled={isPending}
            variant='destructive'
            size={'sm'}
            onClick={handleDelete}
          >
            {isPending ? 'Excluindo...' : 'Excluir'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
