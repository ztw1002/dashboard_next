// 组件在渲染时，先获取客户数据，然后显示一个带有面包写导航的表单，用于创建发票

import Form from '@/app/ui/invoices/create-form'
// 导入面包屑和表单组件
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
// 获取客户数据
import { fetchCustomers } from '@/app/lib/data'


export default async function Page() {
  const customers = await fetchCustomers()
  // 组件渲染之前，异步获取客户数据

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  )
}
