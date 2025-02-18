# Simple Dialog

## Usage

### Wrap your app root in `DialogProvider`

```tsx
import DialogProvider from "@/lib/dialog";

<DialogProvider>// ...the rest of your app</DialogProvider>;
```

### Create and export your `DialogComponent` from maybe `/components/dialogs`

```tsx
import { View, Text, Button } from "react-native";
import React from "react";
import { Dialog, DialogController } from "@/lib/dialog";

export default function DialogComponent({
  controller,
}: {
  controller: DialogController;
}) {
  return (
    <Dialog.Root controller={controller} closeOnOutsidePress>
      <Dialog.Content>
        <View style={{ height: 300, width: 280, padding: 20 }}>
          <Text>TestDialog</Text>
          <Button title="wow" />
        </View>
      </Dialog.Content>
    </Dialog.Root>
  );
}
```

### Use the `useDialog` hook to control your dialog

```tsx
const dialog = useDialog((d) => <DialogComponent controller={d} />);

//   you can use methods like
dialog.open();
dialog.close();
```
