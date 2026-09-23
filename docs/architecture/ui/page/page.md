---
title: Panel
---

# Panel

Panel 是一个可放在 Activity View 或任意 LVGL 父对象上的通用内容面板。它可以显示图标、标题、消息、扩展内容槽和确认/取消按钮。

## 创建

```c
eos_panel_t *panel = eos_panel_create(parent, &cfg);
eos_panel_t *overlay = eos_panel_create_on_activity(activity, &cfg);
```

`eos_panel_create_on_activity` 会在 Activity 的现有 View 上创建前景面板，并隐藏该 Activity 的应用头部；删除面板后原 View 仍在下方。普通 `eos_panel_create` 只使用调用者给出的父对象。

## 配置

```c
eos_panel_cfg_t cfg = {
    .icon_type = EOS_PANEL_ICON_TYPE_SYMBOL,
    .icon_src = LV_SYMBOL_WARNING,
    .title_text = "警告",
    .message_text = "确定要继续吗？",
    .confirm_btn_text = "确定",
    .confirm_cb = on_confirm,
    .cancel_btn_text = "取消",
};
```

标题和消息可使用文本或语言字符串 ID。按钮 ID 为 0 时隐藏对应按钮；确认回调为空时默认不操作，取消回调为空时默认执行 `eos_activity_back()`。

## 扩展内容与释放

```c
lv_obj_t *slot = eos_panel_get_extra_slot(panel);
eos_panel_delete(panel);
```

扩展内容应添加到返回的 slot。面板容器被删除时，组件会自动释放其管理结构；也可以显式调用 `eos_panel_delete`。显式删除后不要再次删除同一面板。
