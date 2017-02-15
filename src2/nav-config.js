const nav = [
  {
    name: 'demo',
    text: '演示',
    icon: 'gear',
    path: '/user',
    children: [
      {
        name: 'user1',
        path: '/user',
        icon: 'user',
        text: '用户管理'
      }, {
        name: 'editor',
        path: '/editor',
        icon: 'file',
        text: '富文本'
      }, {
        name: 'data',
        path: '/data',
        icon: 'file',
        text: '表格'
      }
    ]
  }
]
export default nav
