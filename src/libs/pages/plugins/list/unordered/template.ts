import { ListTemplate } from '@editablejs/models'

export const UnorderedListTemplates: ListTemplate[] = [
  {
      key: 'default',
      depth: 4,
      render: ({ level }) => {
          const l = level % 4
          switch (l) {
              case 1:
                  return { type: 'circle', text: `○` }
              case 2:
                  return { type: 'square', text: `■` }
              case 3:
                  return { type: 'star', text: `★` }
              default:
                  return { type: 'disc', text: `●` }
          }
      },
  }
]


