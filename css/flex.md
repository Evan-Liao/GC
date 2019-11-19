# flex布局使用总结

在flex布局，首先搞清楚两个概念，主轴/交叉轴。  

flex默认主轴方向为水平方向，并且从inline方向延伸，即从左往右排列标签元素，交叉轴与主轴垂直。

## 对齐属性

### `flex-direction`  

改变主轴方向，应用到父级。可选值如下：   

> row // 默认  
> row-reverse // 从右到左水平排放元素  
> column // 设置主轴为垂直方向，元素block排列，至上到下⬇️   
> column-reverse // 设置主轴为垂直方向，元素block排列，至下到上⬆️

可通过`flex-flow`设置`flex-direction`与`flex-wrap`, `flex-wrap`默认为nowrap, 因此flex布局默认对元素不进行换行处理   

```
flex-flow: row nowrap;
```

### `justify-content`

改变元素在主轴的对齐方式，应用到父级。可选值如下：  

> strech // 拉伸填充width or height   
> flex-end //  
> center // 主轴居中对齐，元素间无间隔    
> space-between // 居中对齐，元素间隔相同，贴近边缘border   
> space-around // 居中对齐，元素间隔左右间隔相同， 元素不贴近border

### `align-items`

改变元素在交叉轴的对齐方式，应用到父级。可选值如下： 

> strech // 拉伸填充width or height    
> flex-start // 
> flex-end //    
> center // 交叉轴居中对齐 

 父级设置`align-items`后会应用到所有子元素，可通过修改元素`align-self`的属性，改变元素对齐方式。  


### `align-content`

 `align-content`属性只适用于多行的flex容器，并且当交叉轴上有多余空间使flex容器内的flex线对齐,重点就是多行。 [stackover解释](https://stackoverflow.com/questions/31250174/css-flexbox-difference-between-align-items-and-align-content)







