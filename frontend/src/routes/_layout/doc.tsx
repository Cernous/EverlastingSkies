import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/doc')({
  component: () => <div>Hello /_layout/doc!</div>
})