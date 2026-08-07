---
title: Panel
---

## Panel（面板组件）

Panel 是系统提供的通用对话框组件，用于展示消息提示、确认操作等交互场景。

### 核心功能

Panel 组件提供以下核心能力：

- **灵活的内容展示**：支持图标、标题、消息文本的组合展示
- **国际化支持**：支持通过字符串 ID 或直接文本两种方式设置内容
- **自定义扩展**：提供额外内容槽位，可添加自定义 UI 组件
- **按钮交互**：支持确认和取消两个操作按钮，可自定义回调行为

### 布局结构

Panel 采用垂直居中布局，从上到下依次为：

1. **图标区域**：可选的圆形图标，支持符号（如警告、信息）或图片两种类型
2. **标题区域**：大字体居中显示的标题文本
3. **消息区域**：正文内容，支持自动换行
4. **扩展槽位**：预留的自定义内容区域
5. **操作按钮区域**：水平排列的确认和取消按钮

### 创建方式

#### 在 Activity 上创建

此方式会自动清理 Activity 的视图内容并隐藏应用头部：

```c
eos_panel_t *panel = eos_panel_create_on_activity(activity, &cfg);
```

#### 在任意父对象上创建

提供更灵活的创建方式，可将 Panel 添加到任意 UI 容器中：

```c
eos_panel_t *panel = eos_panel_create(parent, &cfg);
```

### 配置说明

Panel 的配置主要包括以下方面：

- **图标配置**：设置图标类型（符号或图片）、图标源和背景颜色
- **文本配置**：设置标题和消息内容，支持国际化字符串 ID
- **按钮配置**：设置确认和取消按钮的文本及回调函数

### 使用示例

```c
eos_panel_cfg_t cfg = {
    .icon_type = EOS_PANEL_ICON_TYPE_SYMBOL,
    .icon_src = LV_SYMBOL_WARNING,
    .title_text = "警告",
    .message_text = "确定要执行此操作吗？",
    .confirm_btn_text = "确定",
    .confirm_cb = on_confirm,
    .cancel_btn_text = "取消",
};

eos_panel_t *panel = eos_panel_create_on_activity(activity, &cfg);
```

### 自定义内容

通过 `eos_panel_get_extra_slot()` 方法可以获取扩展槽位，在其中添加自定义 UI 组件：

```c
lv_obj_t *extra_slot = eos_panel_get_extra_slot(panel);
// 在 extra_slot 中添加自定义组件
```

### 默认行为

| 按钮   | 默认行为           |
| ---- | -------------- |
| 确认按钮 | 无操作（需自定义回调）    |
| 取消按钮 | 返回上一级 Activity |

### 生命周期管理

Panel 支持两种释放方式：

- **自动释放**：当 Panel 的容器被删除时，会自动释放相关资源
- **手动释放**：调用 `eos_panel_delete(panel)` 手动释放
