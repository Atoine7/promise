class Promise {
  //构造方法
  constructor(executor) {
    //添加属性
    this.PromiseState = 'pending';
    this.PromiseResult = null;
    //声明属性
    this.callbacks = [];
    //保存实例对象的this值
    const self = this;

    function resolve(data) {
      //判断状态
      if (self.PromiseState !== 'pending') return;
      //1.修改对象的状态（promiseState）
      self.PromiseState = 'fulfilled';
      //2.设置对象结果值（promiseResult）
      self.PromiseResult = data;
      //调用成功的回调函数
      setTimeout(() => {
        self.callbacks.forEach(item => {
          item.onResolved(data);
        })
      })

    }

    function reject(data) {
      if (self.PromiseState !== 'pending') return;
      self.PromiseState = 'rejected';
      self.PromiseResult = data;
      setTimeout(() => {
        self.callbacks.forEach(item => {
          item.onRejected(data);
        })
      })
    }

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  //then方法封装
  then(onResolved, onRejected) {
    const self = this;
    //判断回调函数参数
    if (typeof onRejected !== 'function') {
      onRejected = reason => {
        throw reason;
      }
    }
    if (typeof onResolved !== 'function') {
      onResolved = value => {
        return value
      }
    }
    return new Promise((resolve, reject) => {
        //封装函数
        function callback(type) {
          try {
            let result = type(self.PromiseResult);
            if (result instanceof Promise) {
              result.then(v => {
                resolve(v);
              }, r => {
                reject(r);
              });
            } else {
              resolve(result)
            }
          } catch (e) {
            reject(e);
          }
        }

        //调用回调函数 PromiseState
        if (this.PromiseState === 'fulfilled') {
          setTimeout(() => {
            callback(onResolved);
          })
        }
        if (this.PromiseState === 'rejected') {
          setTimeout(() => {
            callback(onRejected);
          })
        }
        //判断pending状态
        if (this.PromiseState === 'pending') {
          this.callbacks.push({
            onResolved: function () {
              callback(onResolved);
            },

            onRejected: function () {
              callback(onRejected);
            }
          })
        }
      }
    )

  }

  //catch方法封装
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  //添加resolve方法
  static resolve(value) {
    return new Promise((resolve, reject) => {
      if (value instanceof Promise) {
        value.then(v => {
          resolve(v);
        }, r => {
          reject(r);
        })
      } else {
        resolve(value);
      }
    })
  }

  //添加reject方法
  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }

  //添加all方法
  static all(promises) {
    return new Promise((resolve, reject) => {
      let count = 0;
      let arr = [];
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(v => {
          //通知对象的状态是成功
          //每个promise对象 都成功
          count++;
          //将当前promise对象成功的结果存入到数组中
          arr[i] = v;
          //判断
          if (count === promises.length) {
            //修改状态
            resolve(arr);
          }
        }, r => {
          reject(r);
        })
      }
    })
  }

  //添加race方法
  static race(paomises) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(v => {
          resolve(v);
        }, r => {
          reject(r);
        })
      }
    })
  }
}

