// 提取 formData 的值
// 这段代码将在服务器端运行
'use server'
// 从 zod 库导入，用于数据验证和解析
import { z } from 'zod'
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// 定义表单模式
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
})

const CreateInvoice = FormSchema.omit({ id: true, date: true })

// 接收 formData 的异步函数
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  })

  const amountInCents = amount * 100
  const date = new Date().toISOString().split('T')[0]

  // 创建一个 SQL 查询，将新发票加入到数据库中并传入变量
  await sql`
		INSERT INTO invoices (customer_id, amount, status, date)
		VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
	`
  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}
