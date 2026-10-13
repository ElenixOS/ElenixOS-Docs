---
title: Panel
---

# Panel

Panel is a universal content panel that can be placed on an Activity View or any LVGL parent object. It can display an icon, title, message, extra content slot, and confirm/cancel buttons.

## Creation

```c
eos_panel_t *panel = eos_panel_create(parent, &cfg);
eos_panel_t *overlay = eos_panel_create_on_activity(activity, &cfg);
```

`eos_panel_create_on_activity` creates a foreground panel on the Activity's existing View and hides the Activity's application header; after the panel is deleted, the original View remains underneath. The regular `eos_panel_create` only uses the parent object provided by the caller.

## Configuration

```c
eos_panel_cfg_t cfg = {
    .icon_type = EOS_PANEL_ICON_TYPE_SYMBOL,
    .icon_src = LV_SYMBOL_WARNING,
    .title_text = "Warning",
    .message_text = "Are you sure you want to continue?",
    .confirm_btn_text = "OK",
    .confirm_cb = on_confirm,
    .cancel_btn_text = "Cancel",
};
```

The title and message can use text or language string IDs. When a button ID is 0, the corresponding button is hidden; when the confirm callback is empty, no action is taken by default, and when the cancel callback is empty, `eos_activity_back()` is executed by default.

## Extra Content and Release

```c
lv_obj_t *slot = eos_panel_get_extra_slot(panel);
eos_panel_delete(panel);
```

Extra content is added to the returned slot. When the panel container is deleted, the component automatically releases its management structures; the caller may also explicitly call `eos_panel_delete`. After the panel is deleted, the handle becomes invalid, and repeated deletion is not a valid operation.