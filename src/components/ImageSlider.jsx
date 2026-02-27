import React, { useEffect, useRef, useState } from 'react'
import '../ImageSlider.css'
import { GiCrossMark } from 'react-icons/gi'

// Get array of image paths and their aspect ratios
const getImageArrayWithAspect = async () => {
    const images = import.meta.glob('../assets/img_fly/*.jpg', { eager: true })
    const imagePaths = Object.values(images).map(m => m.default).sort()
    // Load all images and get their aspect ratios
    const promises = imagePaths.map(src => {
        return new Promise(resolve => {
            const img = new window.Image()
            img.onload = () => {
                resolve({ src, aspect: img.naturalWidth / img.naturalHeight })
            }
            img.onerror = () => resolve({ src, aspect: 1 }) // fallback
            img.src = src
        })
    })
    return Promise.all(promises)
}

// Generate images outside of component to avoid impure function calls during render
const generateRowImages = async () => {
    const imageArray = await getImageArrayWithAspect()
    const sizes = ['', 'medium', 'small', 'large']
    
    const createRow = (count) => {
        const images = []
        for (let i = 0; i < count; i++) {
            const imgObj = imageArray[Math.floor(Math.random() * imageArray.length)]
            const aspect = imgObj.aspect
            let shape = 'rect-v'
            if (aspect > 1.1) shape = 'rect-h'
            else if (aspect < 0.9) shape = 'rect-v'
            else shape = Math.random() > 0.5 ? 'rect-v' : 'rect-h'
            const size = sizes[Math.floor(Math.random() * sizes.length)]
            const marginLeft = Math.floor(Math.random() * 60) - 20 // -20 to 40px
            const marginRight = Math.floor(Math.random() * 50) - 10 // -10 to 40px
            const translateY = Math.floor(Math.random() * 80) - 40 // -40 to 40px
            const rotate = Math.floor(Math.random() * 30) - 15 // -15 to 15deg
            const scale = 0.8 + Math.random() * 0.4 // 0.8 to 1.2
            images.push({
                src: imgObj.src,
                shape: shape,
                size: size,
                style: {
                    marginLeft: `${marginLeft}px`,
                    marginRight: `${marginRight}px`,
                    transform: `translateY(${translateY}px) rotate(${rotate}deg) scale(${scale.toFixed(2)})`,
                }
            })
        }
        return images
    }

    return {
        row1: createRow(6),
        row2: createRow(7),
        row3: createRow(5),
        row4: createRow(6),
        row5: createRow(5),
        row6: createRow(6),
    }
}

const ImageSlider = ({ visible, onClose }) => {
    const containerRef = useRef(null)
    const [rowImages, setRowImages] = useState(null)

    useEffect(() => {
        generateRowImages().then(setRowImages)
    }, [])

    // Create floating hearts effect
    useEffect(() => {
        if (!visible || !rowImages) return

        const heartEmojis = ['❤️', '💖', '💕', '💗', '💓', '🩷']
        const heartClasses = ['heart-pink', 'heart-red', 'heart-light']

        const createHeart = () => {
            if (!containerRef.current) return

            const heart = document.createElement('div')
            heart.classList.add('floating-heart')
            heart.classList.add(heartClasses[Math.floor(Math.random() * heartClasses.length)])
            heart.innerHTML = heartEmojis[Math.floor(Math.random() * heartEmojis.length)]

            // Random horizontal position
            heart.style.left = Math.random() * 100 + 'vw'

            // Random size
            const size = Math.random() * 25 + 15 + 'px'
            heart.style.fontSize = size

            // Random duration (4-8 seconds)
            const duration = Math.random() * 4 + 4
            heart.style.animationDuration = duration + 's'

            document.body.appendChild(heart)

            // Remove heart after animation completes
            setTimeout(() => {
                heart.remove()
            }, duration * 1000)
        }

        // Create side floating hearts
        const createSideHeart = () => {
            if (!containerRef.current) return

            const heart = document.createElement('div')
            heart.classList.add('floating-heart-side')
            heart.classList.add(heartClasses[Math.floor(Math.random() * heartClasses.length)])
            heart.innerHTML = heartEmojis[Math.floor(Math.random() * heartEmojis.length)]

            // Start from left side
            heart.style.left = '-5vw'
            heart.style.top = Math.random() * 80 + 10 + 'vh'

            const size = Math.random() * 20 + 12 + 'px'
            heart.style.fontSize = size

            const duration = Math.random() * 6 + 6
            heart.style.animationDuration = duration + 's'

            document.body.appendChild(heart)

            setTimeout(() => {
                heart.remove()
            }, duration * 1000)
        }

        const intervalId = setInterval(createHeart, 200)
        const sideIntervalId = setInterval(createSideHeart, 500)

        return () => {
            clearInterval(intervalId)
            clearInterval(sideIntervalId)
            // Clean up any remaining hearts
            document.querySelectorAll('.floating-heart, .floating-heart-side').forEach(heart => heart.remove())
        }
    }, [visible, rowImages])

    // Auto-close after 30 seconds
    useEffect(() => {
        if (!visible || !rowImages) return

        const autoCloseTimer = setTimeout(() => {
            onClose()
        }, 30000) // 30 seconds

        return () => clearTimeout(autoCloseTimer)
    }, [visible, onClose])

    if (!visible || !rowImages) return null

    return (
        <div 
            ref={containerRef}
            className={`image-slider-container ${visible ? 'visible' : ''}`}
        >
            <div className="slider-overlay"></div>
            
            <button className="slider-close-btn" onClick={onClose}>
                <GiCrossMark />
            </button>

            <div className="slider-tracks-wrapper">
                {/* Row 1 */}
                <div className="slider-track row-1">
                    {rowImages.row1.map((image, index) => (
                        <div
                            key={`r1-${index}`}
                            className={`slider-item ${image.shape} ${image.size}`}
                            style={{ backgroundImage: `url(${image.src})`, ...image.style }}
                        />
                    ))}
                </div>

                {/* Row 2 */}
                <div className="slider-track row-2">
                    {rowImages.row2.map((image, index) => (
                        <div
                            key={`r2-${index}`}
                            className={`slider-item ${image.shape} ${image.size}`}
                            style={{ backgroundImage: `url(${image.src})`, ...image.style }}
                        />
                    ))}
                </div>

                {/* Row 3 */}
                <div className="slider-track row-3">
                    {rowImages.row3.map((image, index) => (
                        <div
                            key={`r3-${index}`}
                            className={`slider-item ${image.shape} ${image.size}`}
                            style={{ backgroundImage: `url(${image.src})`, ...image.style }}
                        />
                    ))}
                </div>

                {/* Row 4 */}
                <div className="slider-track row-4">
                    {rowImages.row4.map((image, index) => (
                        <div
                            key={`r4-${index}`}
                            className={`slider-item ${image.shape} ${image.size}`}
                            style={{ backgroundImage: `url(${image.src})`, ...image.style }}
                        />
                    ))}
                </div>

                {/* Row 5 */}
                <div className="slider-track row-5">
                    {rowImages.row5.map((image, index) => (
                        <div
                            key={`r5-${index}`}
                            className={`slider-item ${image.shape} ${image.size}`}
                            style={{ backgroundImage: `url(${image.src})`, ...image.style }}
                        />
                    ))}
                </div>

                {/* Row 6 */}
                <div className="slider-track row-6">
                    {rowImages.row6.map((image, index) => (
                        <div
                            key={`r6-${index}`}
                            className={`slider-item ${image.shape} ${image.size}`}
                            style={{ backgroundImage: `url(${image.src})`, ...image.style }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ImageSlider
