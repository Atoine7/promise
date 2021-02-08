function Promise(executor) {
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
    self.callbacks.forEach(item => {
      item.onResolved(data);
    })
  }

  function reject(data) {
    if (self.PromiseState !== 'pending') return;
    self.PromiseState = 'rejected';
    self.PromiseResult = data;
    self.callbacks.forEach(item => {
      item.onRejected(data);
    })
  }

  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

//添加then方法
Promise.prototype.then = function (onResolved, onRejected) {
  const self = this;
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
        callback(onResolved);
      }
      if (this.PromiseState === 'rejected') {
        callback(onRejected);
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

//添加catch方法
Promise.prototype.catch = function(onRejected){
  return this.then(undefined,onRejected);
}
