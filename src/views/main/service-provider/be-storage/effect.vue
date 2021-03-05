<template>
	<a-modal v-model="visible" title="印象添加" v-bind="modal" class="effect-modal">
		<div style="padding-right: 50px">
			<a-form-model :label-col="{span:5}" :wrapper-col="{span: 19}">
				<a-form-model-item label="合作印象" required>
					<a-textarea v-model="textarea" :rows="5" :maxLength="1024" placeholder="请输入服务商合作印象"></a-textarea>
				</a-form-model-item>
			</a-form-model>
		</div>
		<div slot="footer" style="text-align: center">
			<a-button @click="toCancel">取消</a-button>
      <a-button type="primary" :loading="loading" @click="toSubmit">提交</a-button>
		</div>
	</a-modal>
</template>

<script>
	import { beStorage } from "@/plugin/api/provider";

	export default {
		name:'Effect',
		data(){
			return {
				visible:false,
				loading:false,
				textarea:'',
				modal:{
					centered:true,
					maskClosable:true,
					keyboard:false
				},
				id:'',
			}
		},
		methods:{
			toAdd(id){
				this.id = id;
				this.visible = true;
			},
			toSubmit(){
				this.loading = true;
				if(!this.textarea){
					this.$message.error('请输入服务商合作印象');
					this.loading = false;
				}else {
					beStorage.impression({
						id:this.id,
						impression:this.textarea
					}).then(res=>{
						this.loading = false;
						if(res.code === 20000){
							this.$emit('change',this.textarea);
							this.textarea = '';
							this.visible = false;
							this.$message.success('合作印象添加成功！');
						}else{
							this.$message.error('添加/编辑面谈印象失败');
						}
					}).catch(()=>this.loading = false);
				}
			},
			toCancel(){
				this.visible = false;
				this.id = '';
				this.$emit('onChange',false);
			},
		}
	}
</script>

<style lang="scss">
  .effect-modal{
    .ant-modal-header{
      .ant-modal-title{
        font-size: 16px;
        font-weight: bolder;
      }
    }
  }
</style>
