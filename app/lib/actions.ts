// 提取 formData 的值， Create Server Action
'use server' // 本文件代码将在服务器端运行

import { z } from 'zod' // 从 zod 库导入，用于数据验证和解析
import { sql } from '@vercel/postgres' // 执行sql 查询
import { revalidatePath } from 'next/cache' // 重新验证路径
import { redirect } from 'next/navigation' // 重定向

// 使用 zod定义的表单数据模式
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
		invalid_type_error: 'Please select a customer.',
	}),
  amount: z.coerce
		.number()
		.gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
		invalid_type_error: 'Please select an invoice status.',
	}), // 仅接受 'pending' 或 'paid'
  date: z.string(),
})

// 创建发票模式，省略 id 和 date 字段
const CreateInvoice = FormSchema.omit({ id: true, date: true })
const UpdateInvoice = FormSchema.omit({ id: true, date: true })

export type State = {
	errors?: {
		customerId?: string[]
		amount?: string[]
		status?: string[]
	}
	message?: string | null
}

// 处理表单数据并创建发票
export async function createInvoice(prevState: State, formData: FormData) {
  // 从 formData 中提取 customerId、amount 和 status
  // 并使用 CreateInvoice.parse() 解析和验证
  const validateFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  })

  // const rawFormData = {
  //   customerId: formData.get('customerId'),
  //   amount: formData.get('amount'),
  //   status: formData.get('status'),
  // }

  const amountInCents = amount * 100 // 转换美分
  const date = new Date().toISOString().split('T')[0] // 获取并格式化时间格式

  // 执行 SQL 查询，将新发票加入到数据库中并传入变量
	try {
		await sql`
		INSERT INTO invoices (customer_id, amount, status, date)
		VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
	`
	} catch (error) {
		return {
			message: 'Database Error: Failed to Create Invoice.'
		}
	}
  // 重新验证，重新调用
  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
 
  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
	// throw new Error('Failed to Delete Invoice')
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}