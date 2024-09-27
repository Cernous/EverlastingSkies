import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/')({
  component: () => {
    <></>
  },
  beforeLoad: async () => {
    throw redirect({
      to: "/downloads"
    })
  }
})