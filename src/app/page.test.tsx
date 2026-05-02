import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import CalendarPage from './page'

// Mock the dependencies to avoid complex context setup for basic render
vi.mock('@/lib/AppContext', () => ({
  useAppContext: () => ({
    state: {
      therapists: [],
      appointments: [],
      clients: [],
      services: []
    },
    addAppointment: vi.fn(),
    updateAppointment: vi.fn(),
    cancelAppointment: vi.fn(),
  }),
  AppProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

test('renders Calendar title', () => {
  render(<CalendarPage />)
  expect(screen.getByText('Booking Calendar')).toBeDefined()
})
