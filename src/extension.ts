import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Undo Highlighter extension is now active!');

    const disposable = vscode.workspace.onDidChangeTextDocument((event) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || event.document !== editor.document) {
            return;
        }

        // Sadece Undo için çalış
        if (event.reason === vscode.TextDocumentChangeReason.Undo) {
            // Undo öncesi cursor konumunu kaydet
            const oldSelections = editor.selections.map(sel => new vscode.Selection(sel.start, sel.end));

            event.contentChanges.forEach(change => {
                const start = change.range.start.line;
                const end = change.range.end.line;

                const range = new vscode.Range(
                    new vscode.Position(start, 0),
                    new vscode.Position(end, editor.document.lineAt(end).text.length)
                );

                const decorationType = vscode.window.createTextEditorDecorationType({
                    backgroundColor: "rgba(255, 0, 0, 0.3)"
                });

                editor.setDecorations(decorationType, [range]);

                // 2 saniye sonra highlight silinsin
                setTimeout(() => {
                    editor.setDecorations(decorationType, []);
                    decorationType.dispose();
                }, 2000);
            });

            // Cursor'u eski yerine geri koy
            editor.selections = oldSelections;
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
