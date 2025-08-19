import { ApplicationsTable } from '@/app/components/ApplicationsTable';
import { Button } from '@/app/components/ui/button';
import { InteriorLayout } from '@/app/layouts/InteriorLayout';
import { link } from '@/app/shared/links';
import {db} from '@/db'

export const List = async () => {
  const applications = await db.application.findMany();
  return <InteriorLayout>
    <div className='px-page-side flex justify-between items-center'>
      <h1 className='page-title'>All Applications</h1>
      <div>
        <Button asChild><a href={link("/")}>New Application</a></Button>
      </div>
    </div>
    <ApplicationsTable />
    <pre>{JSON.stringify(applications, null, 2)}</pre>
  </InteriorLayout>
};