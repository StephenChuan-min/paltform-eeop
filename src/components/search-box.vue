<template>
  <div class="search-box">
    <div class="search-box-item" :key="JSON.stringify(item)" v-for="item in showList">
      <p class="search-box-item-title">{{item.titleName}}</p>
      <ul class="search-box-item-select-list">
        <li
            class="list-item"
            :class="{'list-item-active':i.active}"
            :key="i.value"
            v-for="i in item.selectList"
            @click="changeActive(i,item.selectList)"
        >
          {{i.label}}
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
export default {
  name: 'SearchBox',
  data() {
    return {
      showList:this.boxObjectList,
    };
  },
  props:{
    boxObjectList:{
      type: Array,
      default: ()=>[
        {
          paramName:'aa',
          multiple:false,
          selectList:[{
            active:true,
            label:'北京',
            value:'1'
          }]
        },
      ]
    },
  },
  methods:{
    changeActive(val,list){
      let temp = list;
      for(let i = 0;i < temp.length;i++){
        temp[i].active = temp[i].value === val.value;
      }
      this.showList.selectList = temp
      this.$emit('selectChange',this.getChangeParams())
    },
    getChangeParams(){
      let temp = this.showList;
      let data = {};
      temp.forEach(item=>{
        item.selectList.forEach(i=>{
          if(i.active){
            data[item.paramName] = i.value
          }
        })
      })
      return data
    }
  }
}
</script>

<style scoped lang="scss">
.search-box{
  width:1200px;
  height:300px;
  background-color: #fff;
  margin: 10px;
  border: 1px solid;
  &-item{
    border-bottom: 1px dashed;
    padding: 20px;
    &-title{
      display: inline-block;
      width: 100px;
      margin: 0;
      vertical-align: top;
      padding-top: 5px;
    }
    &-select-list{
      display: inline-block;
      list-style: none;
      margin: 0;
      width:calc(100% - 140px);
      .list-item{
        padding: 5px 8px;
        display: inline-block;
        border-radius: 2px;
        margin-right: 20px;
      }
      .list-item-active{
        color: #fff;
        background-color: #1C80E1;
      }
    }
  }
}

</style>
