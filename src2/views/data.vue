<style lang='scss'>
  .desc {
    margin-top: 20px;
    margin-bottom: 40px;
  }
</style>
<template>
  <data-tables :data='tableData',
   @row-click='rowClick'>
  <el-table-column prop="flow_no"
                   label="服务编号"
                   sortable="custom">
  </el-table-column>
  <el-table-column
          prop="flow_no"
          label="服务编号"
          sortable="custom">
  </el-table-column>
  </data-tables>
</template>


<script>

import mockData from '../../mock/test'

export default {
  name: 'app',


  data() {
    return {
      tableData: []
    }
  },

  created() {
    this.tableData1 = mockData.list
    for (var i = 0; i < 100; i++) {
      this.tableData = this.tableData.concat(mockData.list)
    }
  },

  methods: {
    getActionsDef() {
      let self = this
      return {
        width: 5,
        def: [{
          name: 'new',
          handler() {
            self.$message('new clicked')
          },
          icon: 'plus'
        }, {
          name: 'import',
          handler() {
            self.$message('import clicked')
          },
          icon: 'upload'
        }]
      }
    },
    getCheckFilterDef() {
      return {
        width: 14,
        props: 'state_code',
        def: [{
          'code': 'created',
          'name': '未处理'
        }, {
          'code': 'assigned',
          'name': '已派工'
        }, {
          'code': 'accepted',
          'name': '已接单'
        }, {
          'code': 'closed',
          'name': '已结束'
        }, {
          'code': 'cancelled',
          'name': '已取消'
        }]
      }
    },
    getRowActionsDef() {
      let self = this
      return [{
        type: 'primary',
        handler(row) {
          self.$message('Edit clicked')
          console.log('Edit in row clicked', row)
        },
        name: 'Edit'
      }, {
        type: 'primary',
        handler(row) {
          self.$message('RUA in row clicked')
          console.log('RUA in row clicked', row)
        },
        name: 'RUA'
      }]
    },
    rowClick(row) {
      this.$message('row clicked')
      console.log('row clicked', row)
    },
    handleSelect(selection, row) {
      console.log('handleSelect', selection, row)
    },
    handleAllSelect(selection) {
      console.log('handleAllSelect', selection)
    },
    handleCurrentRowChange(currentRow, oldCurrentRow) {
      console.log('handleCurrentRowChange', currentRow, oldCurrentRow)
    },
    handleFilterDataChange(filteredData) {
      console.log('handleFilterDataChange', filteredData)
    },
    getSearchDef() {
      return {
        offset: 12,
        props: ['state', 'flow_type'] // can be string or Array
      }
    },
    getSearchDef1() {
      return {
        offset: 12,
        filterFunction(el, filter) {
          return filter.val === el.state_code
        }
      }
    },
    getPaginationDef() {
      return {
        layout: 'total, prev, pager, next, jumper, sizes',
        pageSize: 1,
        pageSizes: [1, 2, 3],
        currentPage: 2
      }
    }
  }
}
</script>
