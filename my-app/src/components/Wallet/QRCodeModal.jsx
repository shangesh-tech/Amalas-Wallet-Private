"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Image from "next/image"
import { X, Copy, QrCode } from "lucide-react"

export default function QRCodeModal({ address, onClose }) {
  const [qrCodeUrl, setQrCodeUrl] = useState("")

  useEffect(() => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${address}`
    setQrCodeUrl(qrUrl)
  }, [address])

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success("Address copied to clipboard!")
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in pt-10">
      <div className="max-w-sm w-full backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl transform scale-95 animate-modal-pop">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Receive ETH</h2>
          <button onClick={onClose} aria-label="Close" className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="text-center space-y-6">
          {/* QR Code */}
          <div className="bg-white p-4 rounded-2xl mx-auto w-fit">
            {qrCodeUrl ? (
              <div className="relative w-48 h-48">
                <Image
                  src={qrCodeUrl}
                  alt="QR Code for wallet address"
                  fill
                  style={{ objectFit: 'contain' }}
                  unoptimized={true} // Use this for external APIs
                  onError={() => setQrCodeUrl("")} // Handle error by clearing URL
                />
              </div>
            ) : (
              <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center text-center">
                <span className="text-gray-500 text-sm p-4">Error generating QR Code</span>
              </div>
            )}
          </div>

          {/* Address */}
          <div>
            <p className="text-white/70 text-sm mb-2">Your wallet address</p>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-white font-mono text-sm break-all mb-3">{address}</div>
              <button
                onClick={() => copyToClipboard(address)}
                className="w-full py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Copy size={16} />
                <span>Copy Address</span>
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <QrCode size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-blue-300 font-medium text-sm">How to receive</h4>
                <p className="text-blue-200 text-xs mt-1">
                  Share this address or QR code with the sender. Only send Ethereum (ETH) and ERC-20 tokens to this
                  address.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}