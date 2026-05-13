import UIKit
import Capacitor

class ViewController: CAPBridgeViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        webView?.scrollView.contentInsetAdjustmentBehavior = .never
    }
}
