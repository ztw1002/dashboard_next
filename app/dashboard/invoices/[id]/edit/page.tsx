// 编辑发票的页面组件

// 导入表单组件，用于编辑发票
import Form from '@/app/ui/invoices/edit-form'
// 用于显示当前页面的导航路径
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
// 从 data 文件导入的函数，用于获取客户数据
import { fetchCustomers } from '@/app/lib/data'

// Page：异步函数组件
export default async function Page() {
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

// 未定义的变量通常会在组件渲染之前通过某种方式获取