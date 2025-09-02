import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Undo Highlighter extension is now ACTIVE!');

    // Sağ altta sürekli görünen işaret
    const disposableStatus = vscode.window.setStatusBarMessage('✅ Undo Highlighter Aktif');
    context.subscriptions.push(disposableStatus);

    const disposable = vscode.workspace.onDidChangeTextDocument((event) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || event.document !== editor.document) return;

        // Filtre kaldırıldı → her değişiklikte highlight
        event.contentChanges.forEach(change => {
            const start = change.range.start.line;
            const end = change.range.end.line;

            const range = new vscode.Range(
                new vscode.Position(start, 0),
                new vscode.Position(end, editor.document.lineAt(end).text.length)
            );

            const decorationType = vscode.window.createTextEditorDecorationType({
                backgroundColor: "rgba(255, 200, 0, 0.4)"
            });

            editor.setDecorations(decorationType, [range]);

            // 1.5 saniye sonra highlight silinsin
            setTimeout(() => {
                editor.setDecorations(decorationType, []);
                decorationType.dispose();
            }, 1500);
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
    console.log('Undo Highlighter extension is now DEACTIVATED.');
}
