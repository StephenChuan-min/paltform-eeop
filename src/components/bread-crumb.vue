<template>
  <div>
    <a-affix :offset-top="64" v-if="fixed">
      <div class="bread-crumb-wrapper">
        <a-icon :type="icon" v-if="icon" class="bread-crumb-icon"/>
        <a-breadcrumb class="bread-crumb">
          <a-breadcrumb-item v-for="item in source" :key="item.id">
            <router-link :to="item.path" v-if="item.path">{{ item.title }}</router-link>
            <span v-else>{{ item.title }}</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
        <div class="bread-crumb-slot" >
          <slot name="suffix"/>
        </div>
      </div>
    </a-affix>
    <div class="bread-crumb-wrapper" v-if="!fixed">
      <a-icon :type="icon" v-if="icon" class="bread-crumb-icon"/>
      <a-breadcrumb class="bread-crumb">
        <a-breadcrumb-item v-for="item in source" :key="item.id">
          <router-link :to="item.path" v-if="item.path">{{ item.title }}</router-link>
          <span v-else>{{ item.title }}</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <div class="bread-crumb-slot" >
        <slot name="suffix"/>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'BreadCrumb',
  data() {
    return {};
  },
  props:{
    source:{
      type: Array,
      default: ()=>[],
    },
    icon: {
      type:String,
      default:'environment',
    },
    fixed:{
      type: Boolean,
      default: false,
    }
  }
}
</script>

<style scoped lang="scss">
  .bread-crumb-wrapper {
    padding: 16px;
    position: relative;
    line-height: 20px;
    font-size: 14px;
    background-color: #ffffff;
    border-bottom: 1px solid $border-base;
    .bread-crumb {
      display: inline-block;

      &-icon {
        margin-right: 10px;
        display: inline-block;
      }

      &-slot {
        position: absolute;
        top: 0;
        right: 16px;
        z-index: 1;
				bottom:0;
				display: flex;
				align-items: center;
				/*实现水平居中*/
				justify-content: center;
      }
    }
  }
</style>
