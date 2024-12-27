// 提取 formData 的值， Create Server Action

// 本文件代码将在服务器端运行
'use server'
// 从 zod 库导入，用于数据验证和解析
import { z } from 'zod' // 数据验证和解析
import { sql } from '@vercel/postgres'  // 执行sql 查询
import { revalidatePath } from 'next/cache'  // 重新验证路径
import { redirect } from 'next/navigation'  // 重定向

// 使用 zod定义的表单数据模式
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']), // 仅接受 'pending' 或 'paid'
  date: z.string()
})

// 创建发票模式，省略 id 和 date 字段
const CreateInvoice = FormSchema.omit({ id: true, date: true })

// 处理表单数据并创建发票
export async function createInvoice(formData: FormData) {
	// 从 formData 中提取 customerId、amount 和 status
	// 并使用 CreateInvoice.parse() 解析和验证
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  })

	// 转换美分
  const amountInCents = amount * 100
	// 获取并格式化时间格式
  const date = new Date().toISOString().split('T')[0]

  // 执行一个 SQL 查询，将新发票加入到数据库中并传入变量
  await sql`
		INSERT INTO invoices (customer_id, amount, status, date)
		VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
	`
	// 重新验证，重新调用
  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}
