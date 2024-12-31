import Pagination from '@/app/ui/invoices/pagination'
import Search from '@/app/ui/search'
// 展示新发票
import Table from '@/app/ui/invoices/table'
// 按钮组件，用于创建新发票
import { CreateInvoice } from '@/app/ui/invoices/buttons'
import { lusitana } from '@/app/ui/fonts'
// 骨架屏组件，用于在数据加载时显示占位内容
import { InvoicesTableSkeleton } from '@/app/ui/skeletons'
import { Suspense } from 'react'
import { fetchInvoicesPages } from '@/app/lib/data'

// 异步函数组件，接收 props 作为参数，其中包含 searchParams
// searchparams 是一个包含查询参数的 Promise 对象
// 用于获取搜索查询和当前页码
export default async function Page(props: {
  searchParams?: Promise<{
    query?: string
    page?: string
  }>
}) {
  // 等待 searchParams 的解析
  const searchParams = await props.searchParams

  // 获取查询参数中的 query 值
  // 如果查询参数中没有 query，则使用空字符串作为默认值
  const query = searchParams?.query || ''
  // 获取查询参数中的 page，并转换为数字类型，如果没有则默认为 1
  const currentPage = Number(searchParams?.page) || 1

  // 根据查询参数中的 query 获取发票总页数
  const totalPages = await fetchInvoicesPages(query)
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
			{/* 使用 suspense 组件包裹表格组件 */}
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  )
}
