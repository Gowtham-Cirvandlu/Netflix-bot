import { useNavigate } from 'react-router-dom'
import { Lock, X, Crown, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { getPosterUrl } from '@/api/omdb'
import type { Movie } from '@/types/movie'

interface PremiumGateModalProps {
  movie: Movie | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isGuest: boolean
}

export default function PremiumGateModal({
  movie,
  open,
  onOpenChange,
  isGuest,
}: PremiumGateModalProps) {
  const navigate = useNavigate()

  if (!movie) return null

  const posterUrl = getPosterUrl(movie.Poster)

  const handleUpgrade = () => {
    if (isGuest) {
      navigate('/login')
    } else {
      // Navigate to upgrade/subscription page
      navigate('/upgrade')
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full bg-gradient-to-br from-gray-900 to-black border border-netflix-red/30 p-0 overflow-hidden text-white">
        {/* Backdrop with blur */}
        <div className="relative h-[250px] overflow-hidden">
          {posterUrl ? (
            <>
              <img
                src={posterUrl}
                alt={movie.Title}
                className="w-full h-full object-cover blur-[2px] brightness-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gray-800" />
          )}

          {/* Lock Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-netflix-red/20 rounded-full p-6 backdrop-blur-sm border border-netflix-red/40">
              <Lock className="w-12 h-12 text-netflix-red" />
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-50 bg-black/70 rounded-full p-2 hover:bg-black transition-all duration-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-netflix-red" />
              <h2 className="text-2xl font-bold">Premium Content</h2>
              <Crown className="w-5 h-5 text-netflix-red" />
            </div>
            <p className="text-gray-400">
              {movie.Title} is available exclusively to premium members
            </p>
          </div>

          {/* Features */}
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6 space-y-3">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-netflix-red mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Watch Unlimited</p>
                <p className="text-sm text-gray-400">
                  Access thousands of premium movies and series
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Crown className="w-5 h-5 text-netflix-red mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">No Ads</p>
                <p className="text-sm text-gray-400">
                  Enjoy uninterrupted streaming experience
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-netflix-red mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Exclusive Access</p>
                <p className="text-sm text-gray-400">
                  Get early access to new releases
                </p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-netflix-red/10 border border-netflix-red/30 rounded-lg p-4 mb-6 text-center">
            <p className="text-gray-400 text-sm mb-2">Get Premium Now</p>
            <p className="text-3xl font-bold mb-1">$9.99</p>
            <p className="text-gray-400 text-sm">per month, cancel anytime</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleUpgrade}
              className="w-full bg-netflix-red hover:bg-[#B81D24] text-white font-semibold py-3"
            >
              {isGuest ? 'Sign In to Upgrade' : 'Upgrade to Premium'}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full border-gray-600 text-white hover:bg-gray-800"
            >
              Continue Browsing
            </Button>
          </div>

          {/* Footer text */}
          <p className="text-center text-xs text-gray-500 mt-4">
            First month is 50% off for new members
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
