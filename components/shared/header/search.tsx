import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAllCategories } from '@/lib/actions/product-actions';
import { SearchIcon } from 'lucide-react';
import React from 'react';

export default async function Search() {
  const categories = await getAllCategories();

  return (
    <form action={'/search'} method='GET'>
      <div className='flex w-full max-w-sm items-center space-x-2'>
        <Select name='category'>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Todos' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todos</SelectItem>
            {categories.map((x) => (
              <SelectItem key={x.category} value={x.category}>
                {x.category} ({x._count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          name='q'
          type='text'
          placeholder='Buscar produtos...'
          className='md:w-[200px] lg:w-[300px]'
        />
        <Button>
          <SearchIcon className='h-4 w-4' />
        </Button>
      </div>
    </form>
  );
}
