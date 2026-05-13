import UIKit
import Capacitor

class ViewController: CAPBridgeViewController {

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()

        guard let webView = webView else { return }

        let insets = view.safeAreaInsets
        webView.frame = CGRect(
            x: insets.left,
            y: insets.top,
            width: view.bounds.width - insets.left - insets.right,
            height: view.bounds.height - insets.top - insets.bottom
        )
    }
}
