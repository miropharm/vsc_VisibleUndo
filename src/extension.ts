import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Undo Cursor Stabilizer active');

    let beforeUndo: vscode.Selection[] = [];

    // Cursor her değiştiğinde "önceki"ni sakla
    vscode.window.onDidChangeTextEditorSelection((e) => {
        if (e.textEditor === vscode.window.activeTextEditor) {
            beforeUndo = e.selections.map(sel => new vscode.Selection(sel.start, sel.end));
        }
    });

    // Undo tetiklendiğinde yakala
    vscode.workspace.onDidChangeTextDocument((event) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || event.document !== editor.document) return;

        if (event.reason === vscode.TextDocumentChangeReason.Undo && beforeUndo.length > 0) {
            // Cursor VS Code tarafından zıplatıldıktan hemen sonra geri koy
            setTimeout(() => {
                try {
                    editor.selections = beforeUndo;
                    editor.revealRange(
                        new vscode.Range(beforeUndo[0].active, beforeUndo[0].active),
                        vscode.TextEditorRevealType.Default
                    );
                } catch { /* ignore */ }
            }, 50); // gerekirse 50 → 100 ms yap
        }
    });
}

export function deactivate() {}
