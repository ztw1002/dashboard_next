// 编辑发票的页面组件

// 导入表单组件，用于编辑发票
import Form from '@/app/ui/invoices/edit-form'
// 用于显示当前页面的导航路径
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
// 从 data 文件导入的函数，用于获取客户数据
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data'
import {notFound} from 'next/navigation'

// Page：异步函数组件
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const id = params.id
	const [invoice, customers] = await Promise.all([
		fetchInvoiceById(id),
		fetchCustomers(),
	])

	if (!invoice) {
		notFound()
	}
  return (
    <main>
      {/* 显示当前页面的导航路径 */}
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
            // 设置为当前活动项
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  )
}