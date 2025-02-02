import { v4 as uuidv4 } from "uuid";

export const getURLWithParams = (url: string, params: { [key: string]: any }) => {
	let final_URL = url;
	const ret = [];
	for (let key in params)
		ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
	final_URL += (ret.length > 0) ? "?" + ret.join('&') : "";
	return final_URL;
}

export const getAndSetAnonymousIdFromLocalStorage = () => {
	const localStorageAnonymousId = localStorage.getItem('AnonymousId');
    const anonymousId: string = (localStorageAnonymousId && localStorageAnonymousId != null) ? localStorageAnonymousId : uuidv4();
	localStorage.setItem('AnonymousId', anonymousId);
	return anonymousId;
}