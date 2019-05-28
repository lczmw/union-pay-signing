import Cookies from 'js-cookie'
import { setStore, removeStore, getStore } from '@/utils'

export default {
    data() {
        return {
            signId: Cookies.get('sign_id'),
        }
    },
    methods: {
        globalMixin_validFormEmpty(validField, formData) {
            return new Promise((resolve, reject) => {
                let ar = Object.keys(validField);
                for (let i = 0, len = ar.length; i < len; i++) {

                    let curField = formData[ar[i]];
                    let curValid = validField[ar[i]];
                    let curValidType = Object.prototype.toString.call(curValid);
                    if (typeof curField === 'undefined') {
                        continue
                    }
                    if (curValidType === '[object String]') {
                        if (curField === '' || curField.length === 0) {
                            let errMsy = curValid;
                            this.$toast({
                                message: curValid,
                                duration: 2000
                            });
                            reject(errMsy);
                            return;
                        }
                    }
                    if (curValidType === '[object Object]') {
                      
                        if (curField === '' || curField.length === 0) {
                            let errMsy = curValid.emptyMsg;
                            this.$toast({
                                message: errMsy,
                                duration: 2000
                            });
                            reject(errMsy);
                            return;
                        }

                        if (!curValid['re'].test(curField)) {
                            let errMsy = curValid.reMsg;
                            this.$toast({
                                message: errMsy,
                                duration: 2000
                            });
                            reject(errMsy);
                            return;
                        }
                    }

                
                }
                resolve();
            })
        },
        globalMixin_updateSigning(signing = {}) {
            setStore('pospal_signing', signing)
        },
        globalMixin_getSigning(signing = {}) {
            return getStore('pospal_signing', true)
        }

    }
}