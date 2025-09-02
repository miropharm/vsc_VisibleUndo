import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const decorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: "rgba(255, 255, 0, 0.4)" // sarı highlight
  });

  vscode.workspace.onDidChangeTextDocument((event) => {
    // sadece undo veya redo olaylarını yakalayalım
    if (event.reason === vscode.TextDocumentChangeReason.Undo || event.reason === vscode.TextDocumentChangeReason.Redo) {
      const editor = vscode.window.activeTextEditor;
      if (!editor || event.document !== editor.document) return;

      const ranges: vscode.Range[] = event.contentChanges.map(change => change.range);

      // Highlight uygula
      editor.setDecorations(decorationType, ranges);

      // Görünen alana getir
      if (ranges.length > 0) {
        editor.revealRange(ranges[0], vscode.TextEditorRevealType.InCenter);
      }

      // 2 saniye sonra highlight'ı kaldır
      setTimeout(() => {
        editor.setDecorations(decorationType, []);
      }, 2000);
    }
  });
}

export function deactivate() {}
