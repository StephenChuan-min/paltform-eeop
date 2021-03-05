import { getDownLoadToken } from "@/plugin/api/base";
const area = global.FIELD_ADDRESS || [];

/**
 * 清空原型链内容
 * @param obj
 * @returns {{}}
 */

export const clearProto = obj => {
	let _obj = {};
	Object.keys(obj).forEach(i => _obj[i] = obj[i]);
	return _obj;
};

/**
 * antd DataPick组件，前后联动
 * @param startValue
 * @param endValue
 * @param type
 * @returns {boolean}
 */
export const disabledDate = (startValue, endValue, type) => {
	if (!startValue || !endValue) return false;
	const startVal = startValue.valueOf();
	const endVal = endValue.valueOf();
	return type === 'start' ? startVal > endVal : startVal >= endVal;
};

/**
 * 获取随机字符串
 * @param l {number}
 * @returns {string}
 */
export const ranStr = (l = 4) => {
	const len = l || 32;
	const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	/** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1*** */
	const maxPos = $chars.length;
	let pwd = '';
	for (let i = 0; i < len; i += 1) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return `_${pwd}`;
};

/**
 * 过滤对象中的空属性
 * @param obj
 * @returns obj
 */
export const clearObject = (obj) => {
	const newObj = {};
	Object.keys(obj).forEach((key) => {
		const value = obj[key];
		if (value !== '' && value !== undefined && value !== null) {
			newObj[key] = value;
		}
	});
	return newObj;
};

/**
 * 获取fileList - async
 * @param str
 */
export const fileListRuleAsync = (str) => {
	if (!str) return [];
	if (!Array.isArray(JSON.parse(str))) return [];
	return Promise.all(JSON.parse(str).map(async i => {
		if (i.viewUrl) return i;
		else {
			return getDownLoadToken(i.hash || i.url).then(res => {
				if (res.code === 20000) {
					i.viewUrl = res.data;
					i.url = res.data;
					i.status = 'done';
				}
				return i;
			});
		}
		// ...i,
		// status: 'done',
	}))
};

/**
 * 获取fileList
 * @param str
 */
export const fileListRule = (str) => {
	if (!str) return [];
	if (!Array.isArray(JSON.parse(str))) return [];
	return JSON.parse(str).map(i => {
		if(typeof i === 'string'){
			return {
				uid: i,
				hash:i,
				name :(i.split('_'))[2] || i,
				status: 'done',
			}
		}else{
			const name = i.name || (i.name.split('_'))[2] || i;
			return {
				...i,
				name,
				status: 'done',
			}
		}

	})
};
/**
 * 获取省市区组合名称
 * @param provinceCode
 * @param cityCode
 * @param areaCode
 * @returns string
 */
export const getArea = (provinceCode, cityCode, areaCode) => {
	// TODO {
	//    1. 参数的有误判断；
	//    2. 二参数的逻辑实现；
	//    3. ForEach的循环参数的是否判断；
	//  }
	let areaParams = [];
	area.forEach((province) => {
		if (parseInt(provinceCode) === province.id) {
			areaParams.push(province.name)
		}
		province.children.forEach((city) => {
			if (parseInt(cityCode) === city.id) {
				areaParams.push(city.name)
			}
			city.children.forEach((area) => {
				if (parseInt(areaCode) === area.id) {
					areaParams.push(area.name)
				}
			})
		})
	});
	return areaParams.join("");
};

/**
 * 省市区结构-反解析
 * @param str
 * @param single
 */
export const  areaAnalysis = (str, single = true) => {
	if (!str) return '';
	const _str = (str || '').split(',').filter(i => i);
	return single ? _str : _str.map(i => i.split('/').filter(i => i));
};
