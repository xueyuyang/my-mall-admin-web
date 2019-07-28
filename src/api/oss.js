import request from '@/utils/request'
export function policy() {
  return request({
    url:'/aliyun/oss/policy',
    method:'get',
  })
}

export function queryAttachmentById(id) {
	return request({
    url:'/opc/file/queryAttachmentById/'+id,
    method:'post',
  })
}

export async function queryAttachmentByIdSync(id) {
	return await queryAttachmentById(id);
}
