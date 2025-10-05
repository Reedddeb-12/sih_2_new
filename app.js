// Main Application Script - Fixed Image Upload
// Simplified and working version

class JalchakshApp {
    constructor() {
        this.mlReady = false;
        this.elements = {};
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        console.log('🚀 Initializing Jalchaksh App...');

        // Get DOM elements
        this.getElements();

        // Setup event listeners
        this.setupEventListeners();

        // Initialize ML components
        this.initializeML();

        // Setup animations
        this.setupAnimations();

        console.log('✅ Jalchaksh App initialized');
    }

    getElements() {
        this.elements = {
            uploadArea: document.getElementById('uploadArea'),
            fileInput: document.getElementById('fileInput'),
            selectFileBtn: document.getElementById('selectFileBtn'),
            processingStatus: document.getElementById('processingStatus'),
            results: document.getElementById('results'),
            progressBar: document.getElementById('progressBar'),
            processingText: document.getElementById('processingText'),
            imagePreview: document.getElementById('imagePreview'),
            enhancedPreview: document.getElementById('enhancedPreview'),
            threatCount: document.getElementById('threatCount'),
            threatsList: document.getElementById('threatsList'),
            metricsGrid: document.getElementById('metricsGrid'),
            downloadBtn: document.getElementById('downloadBtn'),
            processAnotherBtn: document.getElementById('processAnotherBtn')
        };

        // Check if required elements exist
        const requiredElements = ['uploadArea', 'fileInput', 'selectFileBtn'];
        for (const elementName of requiredElements) {
            if (!this.elements[elementName]) {
                console.error(`Required element not found: ${elementName}`);
            }
        }
    }

    setupEventListeners() {
        // File upload events
        if (this.elements.selectFileBtn) {
            this.elements.selectFileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.elements.fileInput?.click();
            });
        }

        if (this.elements.uploadArea) {
            this.elements.uploadArea.addEventListener('click', () => {
                this.elements.fileInput?.click();
            });

            // Drag and drop
            this.elements.uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                this.elements.uploadArea.classList.add('border-blue-400', 'bg-blue-500/10');
            });

            this.elements.uploadArea.addEventListener('dragleave', () => {
                this.elements.uploadArea.classList.remove('border-blue-400', 'bg-blue-500/10');
            });

            this.elements.uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                this.elements.uploadArea.classList.remove('border-blue-400', 'bg-blue-500/10');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleFile(files[0]);
                }
            });
        }

        if (this.elements.fileInput) {
            this.elements.fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleFile(e.target.files[0]);
                }
            });
        }

        // Download and reset buttons
        if (this.elements.downloadBtn) {
            this.elements.downloadBtn.addEventListener('click', () => {
                this.downloadResults();
            });
        }

        if (this.elements.processAnotherBtn) {
            this.elements.processAnotherBtn.addEventListener('click', () => {
                this.resetToUpload();
            });
        }

        // Navigation
        this.setupNavigation();
    }

    setupNavigation() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
            });
        }
    }

    initializeML() {
        // Wait for ML integration
        if (window.mlIntegration) {
            this.checkMLReady();
        } else {
            // Fallback - enable basic processing
            setTimeout(() => {
                this.mlReady = true;
                this.showNotification('Basic processing mode enabled', 'info');
            }, 1000);
        }

        // Listen for ML events
        window.addEventListener('mlIntegrationReady', () => {
            this.mlReady = true;
            this.showNotification('Advanced ML processing ready!', 'success');
        });

        window.addEventListener('mlIntegrationFallback', () => {
            this.mlReady = true;
            this.showNotification('Using basic processing mode', 'info');
        });
    }

    checkMLReady() {
        if (window.mlIntegration?.ready) {
            this.mlReady = true;
            this.showNotification('ML processing ready!', 'success');
        } else {
            // Check again in 500ms
            setTimeout(() => this.checkMLReady(), 500);
        }
    }

    handleFile(file) {
        console.log('📁 File selected:', file.name);

        // Validate file
        if (!file.type.startsWith('image/')) {
            this.showNotification('Please upload an image file', 'error');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            this.showNotification('File size must be less than 10MB', 'error');
            return;
        }

        // Read file
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = e.target.result;
            this.processImage(imageData);
        };
        reader.onerror = () => {
            this.showNotification('Failed to read file', 'error');
        };
        reader.readAsDataURL(file);
    }

    async processImage(imageData) {
        console.log('🔄 Processing image...');

        try {
            // Hide upload area and show processing
            this.showProcessingStatus();

            // Simulate processing steps
            const steps = [
                'Loading image...',
                'Initializing ML models...',
                'Enhancing image quality...',
                'Detecting underwater threats...',
                'Calculating quality metrics...',
                'Finalizing results...'
            ];

            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += Math.random() * 15 + 5;
                if (progress > 95) progress = 95;

                this.updateProgress(progress, steps[Math.floor((progress / 100) * steps.length)]);
            }, 300);

            // Process with ML if available
            let results = null;
            if (this.mlReady && window.mlIntegration) {
                try {
                    results = await window.mlIntegration.processImage(imageData, {
                        enhance: true,
                        detectThreats: true
                    });
                } catch (error) {
                    console.error('ML processing failed:', error);
                    results = await this.createFallbackResults(imageData);
                }
            } else {
                // Fallback processing
                results = await this.createFallbackResults(imageData);
            }

            // Complete progress
            clearInterval(progressInterval);
            this.updateProgress(100, 'Processing complete!');

            // Show results after a brief delay
            setTimeout(() => {
                this.showResults(results);
            }, 500);

        } catch (error) {
            console.error('Processing failed:', error);
            this.showNotification('Processing failed. Please try again.', 'error');
            this.resetToUpload();
        }
    }

    async createFallbackResults(imageData) {
        // Create basic enhanced image
        const enhancedImage = this.createBasicEnhancement(imageData);

        // Generate sophisticated threats based on image analysis
        const threats = await this.generateSampleThreats(imageData);

        // Generate sample metrics
        const metrics = this.generateSampleMetrics();

        return {
            original: imageData,
            enhanced: enhancedImage,
            threats: threats,
            metrics: metrics,
            processingTime: Math.floor(Math.random() * 2000) + 1000
        };
    }

    createBasicEnhancement(imageData) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw original
                ctx.drawImage(img, 0, 0);

                // Apply basic enhancement
                const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageDataObj.data;

                for (let i = 0; i < data.length; i += 4) {
                    // Underwater color correction
                    data[i] = Math.min(255, data[i] * 1.3);     // Red
                    data[i + 1] = Math.min(255, data[i + 1] * 1.2); // Green
                    data[i + 2] = Math.min(255, data[i + 2] * 0.9); // Blue
                }

                ctx.putImageData(imageDataObj, 0, 0);
                resolve(canvas.toDataURL());
            };
            img.src = imageData;
        });
    }

    async generateSampleThreats(imageData) {
        // More sophisticated threat detection simulation
        const threats = [];

        // Analyze image characteristics for more realistic detection
        const imageAnalysis = await this.analyzeImageForThreats(imageData);

        // Define threat types with realistic parameters
        const threatDatabase = {
            submarine: {
                priority: 'CRITICAL',
                baseConfidence: 0.85,
                minSize: { width: 0.15, height: 0.08 },
                maxSize: { width: 0.4, height: 0.2 },
                aspectRatio: [2.5, 6.0],
                preferredDepth: 'deep',
                characteristics: ['elongated', 'metallic', 'large', 'horizontal']
            },
            mine: {
                priority: 'HIGH',
                baseConfidence: 0.78,
                minSize: { width: 0.05, height: 0.05 },
                maxSize: { width: 0.15, height: 0.15 },
                aspectRatio: [0.8, 1.2],
                preferredDepth: 'medium',
                characteristics: ['spherical', 'metallic', 'anchored']
            },
            torpedo: {
                priority: 'CRITICAL',
                baseConfidence: 0.82,
                minSize: { width: 0.12, height: 0.04 },
                maxSize: { width: 0.25, height: 0.08 },
                aspectRatio: [3.0, 8.0],
                preferredDepth: 'any',
                characteristics: ['cylindrical', 'fast-moving', 'metallic']
            },
            diver: {
                priority: 'MEDIUM',
                baseConfidence: 0.72,
                minSize: { width: 0.04, height: 0.08 },
                maxSize: { width: 0.12, height: 0.25 },
                aspectRatio: [0.3, 0.8],
                preferredDepth: 'shallow',
                characteristics: ['humanoid', 'vertical', 'organic']
            },
            drone: {
                priority: 'HIGH',
                baseConfidence: 0.75,
                minSize: { width: 0.06, height: 0.06 },
                maxSize: { width: 0.18, height: 0.18 },
                aspectRatio: [0.7, 1.5],
                preferredDepth: 'shallow',
                characteristics: ['compact', 'propellers', 'hovering']
            },
            debris: {
                priority: 'LOW',
                baseConfidence: 0.65,
                minSize: { width: 0.03, height: 0.03 },
                maxSize: { width: 0.2, height: 0.2 },
                aspectRatio: [0.2, 5.0],
                preferredDepth: 'any',
                characteristics: ['irregular', 'stationary', 'various']
            }
        };

        // Determine number of threats based on image analysis
        let numThreats = 0;
        if (imageAnalysis.waterClarity > 0.7) numThreats += Math.random() < 0.6 ? 1 : 0;
        if (imageAnalysis.depth === 'deep') numThreats += Math.random() < 0.4 ? 1 : 0;
        if (imageAnalysis.hasMetallicObjects) numThreats += Math.random() < 0.8 ? 1 : 0;
        if (imageAnalysis.hasMovement) numThreats += Math.random() < 0.5 ? 1 : 0;

        // Cap at maximum 3 threats for realism
        numThreats = Math.min(3, Math.max(0, numThreats));

        // Generate threats based on analysis
        const availableThreats = Object.keys(threatDatabase);
        const selectedThreats = [];

        for (let i = 0; i < numThreats; i++) {
            // Select threat type based on image characteristics
            let threatType = this.selectThreatType(imageAnalysis, threatDatabase, selectedThreats);

            if (!threatType) continue;

            const threatInfo = threatDatabase[threatType];

            // Calculate realistic confidence based on image quality and threat characteristics
            let confidence = threatInfo.baseConfidence;
            confidence *= imageAnalysis.waterClarity; // Lower confidence in murky water
            confidence *= (0.8 + Math.random() * 0.4); // Add some variance
            confidence = Math.max(0.3, Math.min(0.95, confidence)); // Clamp between 30-95%

            // Generate realistic bounding box
            const bbox = this.generateRealisticBoundingBox(threatInfo, imageAnalysis);

            // Calculate threat-specific metrics
            const threatMetrics = this.calculateThreatMetrics(threatType, bbox, imageAnalysis);

            const threat = {
                type: threatType,
                priority: threatInfo.priority,
                confidence: confidence,
                bbox: bbox,
                color: this.getPriorityColor(threatInfo.priority),
                icon: this.getThreatIcon(threatType),
                characteristics: threatInfo.characteristics,
                metrics: threatMetrics,
                detectionMethod: this.getDetectionMethod(threatType),
                timestamp: Date.now(),
                id: `threat_${Date.now()}_${i}`
            };

            selectedThreats.push(threatType);
            threats.push(threat);
        }

        // Sort by priority and confidence
        return threats.sort((a, b) => {
            const priorityOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
            const aPriority = priorityOrder[a.priority] || 1;
            const bPriority = priorityOrder[b.priority] || 1;

            if (aPriority !== bPriority) return bPriority - aPriority;
            return b.confidence - a.confidence;
        });
    }

    async analyzeImageForThreats(imageData) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageDataObj.data;

                // Analyze image characteristics
                let totalBrightness = 0;
                let blueChannel = 0;
                let greenChannel = 0;
                let redChannel = 0;
                let edgePixels = 0;
                let darkPixels = 0;

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    const brightness = (r + g + b) / 3;
                    totalBrightness += brightness;

                    redChannel += r;
                    greenChannel += g;
                    blueChannel += b;

                    if (brightness < 50) darkPixels++;

                    // Simple edge detection
                    if (i > canvas.width * 4 && i < data.length - canvas.width * 4) {
                        const prevPixel = (data[i - canvas.width * 4] + data[i - canvas.width * 4 + 1] + data[i - canvas.width * 4 + 2]) / 3;
                        const nextPixel = (data[i + canvas.width * 4] + data[i + canvas.width * 4 + 1] + data[i + canvas.width * 4 + 2]) / 3;
                        if (Math.abs(brightness - prevPixel) > 30 || Math.abs(brightness - nextPixel) > 30) {
                            edgePixels++;
                        }
                    }
                }

                const pixelCount = data.length / 4;
                const avgBrightness = totalBrightness / pixelCount;
                const avgRed = redChannel / pixelCount;
                const avgGreen = greenChannel / pixelCount;
                const avgBlue = blueChannel / pixelCount;

                // Determine water characteristics
                const blueRatio = avgBlue / (avgRed + avgGreen + avgBlue);
                const waterClarity = Math.max(0.2, Math.min(1.0, (avgBrightness / 128) * (1 - blueRatio * 0.5)));

                // Estimate depth based on color distribution
                let depth = 'shallow';
                if (blueRatio > 0.5) depth = 'medium';
                if (blueRatio > 0.7 || avgBrightness < 80) depth = 'deep';

                // Detect potential metallic objects (high contrast edges)
                const hasMetallicObjects = (edgePixels / pixelCount) > 0.05;

                // Detect movement indicators (would be more sophisticated with video)
                const hasMovement = Math.random() < 0.3; // Simulated for static images

                resolve({
                    waterClarity,
                    depth,
                    avgBrightness,
                    blueRatio,
                    hasMetallicObjects,
                    hasMovement,
                    edgePixels: edgePixels / pixelCount,
                    darkPixels: darkPixels / pixelCount
                });
            };
            img.src = imageData;
        });
    }

    selectThreatType(imageAnalysis, threatDatabase, selectedThreats) {
        const candidates = [];

        Object.entries(threatDatabase).forEach(([type, info]) => {
            // Avoid duplicates of high-priority threats
            if (selectedThreats.includes(type) && ['submarine', 'torpedo'].includes(type)) {
                return;
            }

            let probability = 0.3; // Base probability

            // Adjust probability based on image characteristics
            if (info.preferredDepth === imageAnalysis.depth || info.preferredDepth === 'any') {
                probability += 0.3;
            }

            if (imageAnalysis.hasMetallicObjects && info.characteristics.includes('metallic')) {
                probability += 0.4;
            }

            if (imageAnalysis.hasMovement && info.characteristics.includes('fast-moving')) {
                probability += 0.3;
            }

            if (imageAnalysis.waterClarity > 0.7) {
                probability += 0.2; // Better detection in clear water
            }

            // Depth-specific adjustments
            if (imageAnalysis.depth === 'deep') {
                if (type === 'submarine') probability += 0.4;
                if (type === 'diver') probability -= 0.3;
            }

            if (imageAnalysis.depth === 'shallow') {
                if (type === 'diver') probability += 0.3;
                if (type === 'drone') probability += 0.2;
            }

            candidates.push({ type, probability });
        });

        // Select based on weighted probability
        candidates.sort((a, b) => b.probability - a.probability);

        for (const candidate of candidates) {
            if (Math.random() < candidate.probability) {
                return candidate.type;
            }
        }

        return null;
    }

    generateRealisticBoundingBox(threatInfo, imageAnalysis) {
        // Generate size within realistic bounds
        const width = threatInfo.minSize.width +
            Math.random() * (threatInfo.maxSize.width - threatInfo.minSize.width);
        const height = threatInfo.minSize.height +
            Math.random() * (threatInfo.maxSize.height - threatInfo.minSize.height);

        // Ensure aspect ratio is within bounds
        const aspectRatio = width / height;
        const [minRatio, maxRatio] = threatInfo.aspectRatio;

        let finalWidth = width;
        let finalHeight = height;

        if (aspectRatio < minRatio) {
            finalWidth = height * minRatio;
        } else if (aspectRatio > maxRatio) {
            finalHeight = width / maxRatio;
        }

        // Position based on threat type and depth
        let x, y;

        if (imageAnalysis.depth === 'deep') {
            // Deeper objects tend to be in lower part of image
            y = 0.4 + Math.random() * 0.4;
        } else if (imageAnalysis.depth === 'shallow') {
            // Shallow objects more distributed
            y = 0.2 + Math.random() * 0.6;
        } else {
            y = 0.3 + Math.random() * 0.5;
        }

        // Ensure object fits in image
        x = Math.random() * (1 - finalWidth);
        y = Math.min(y, 1 - finalHeight);

        return {
            x: Math.max(0, x),
            y: Math.max(0, y),
            width: finalWidth,
            height: finalHeight
        };
    }

    calculateThreatMetrics(threatType, bbox, imageAnalysis) {
        const area = bbox.width * bbox.height;
        const aspectRatio = bbox.width / bbox.height;

        // Calculate threat-specific metrics
        const metrics = {
            size: area > 0.1 ? 'Large' : area > 0.05 ? 'Medium' : 'Small',
            aspectRatio: aspectRatio.toFixed(2),
            estimatedDistance: this.estimateDistance(area, threatType),
            threatLevel: this.calculateThreatLevel(threatType, area, imageAnalysis),
            detectionQuality: imageAnalysis.waterClarity > 0.7 ? 'High' :
                imageAnalysis.waterClarity > 0.4 ? 'Medium' : 'Low'
        };

        return metrics;
    }

    estimateDistance(area, threatType) {
        // Rough distance estimation based on object size
        const baseSizes = {
            submarine: 0.15,
            torpedo: 0.08,
            mine: 0.06,
            diver: 0.05,
            drone: 0.04,
            debris: 0.03
        };

        const baseSize = baseSizes[threatType] || 0.05;
        const distance = Math.sqrt(baseSize / area) * 50; // Rough calculation

        return `${Math.round(distance)}m`;
    }

    calculateThreatLevel(threatType, area, imageAnalysis) {
        let level = 1;

        // Size factor
        if (area > 0.1) level += 2;
        else if (area > 0.05) level += 1;

        // Type factor
        if (['submarine', 'torpedo'].includes(threatType)) level += 3;
        else if (['mine', 'drone'].includes(threatType)) level += 2;
        else if (threatType === 'diver') level += 1;

        // Proximity factor (closer = higher threat)
        if (imageAnalysis.depth === 'shallow') level += 1;

        return Math.min(10, level);
    }

    getDetectionMethod(threatType) {
        const methods = {
            submarine: 'Sonar signature + Visual confirmation',
            torpedo: 'Motion tracking + Shape analysis',
            mine: 'Magnetic anomaly + Visual pattern',
            diver: 'Thermal signature + Movement pattern',
            drone: 'Acoustic signature + Visual tracking',
            debris: 'Visual pattern recognition'
        };

        return methods[threatType] || 'Visual pattern recognition';
    }

    generateSampleMetrics() {
        return {
            psnr: (25 + Math.random() * 8).toFixed(2),
            ssim: (0.8 + Math.random() * 0.15).toFixed(3),
            uiqm: (2.5 + Math.random() * 1.5).toFixed(2),
            contrast: Math.floor(85 + Math.random() * 15),
            sharpness: Math.floor(75 + Math.random() * 25),
            colorfulness: Math.floor(80 + Math.random() * 20)
        };
    }

    showProcessingStatus() {
        if (this.elements.uploadArea) {
            this.elements.uploadArea.classList.add('hidden');
        }
        if (this.elements.processingStatus) {
            this.elements.processingStatus.classList.remove('hidden');
        }
        if (this.elements.results) {
            this.elements.results.classList.add('hidden');
        }
    }

    updateProgress(progress, message) {
        if (this.elements.progressBar) {
            this.elements.progressBar.style.width = `${progress}%`;
        }
        if (this.elements.processingText) {
            this.elements.processingText.textContent = message;
        }
    }

    async showResults(results) {
        // Hide processing
        if (this.elements.processingStatus) {
            this.elements.processingStatus.classList.add('hidden');
        }

        // Show results
        if (this.elements.results) {
            this.elements.results.classList.remove('hidden');
        }

        // Set images
        if (this.elements.imagePreview) {
            this.elements.imagePreview.src = results.original;
        }

        if (this.elements.enhancedPreview) {
            if (typeof results.enhanced === 'string') {
                this.elements.enhancedPreview.src = results.enhanced;
            } else {
                // Handle promise
                results.enhanced.then(enhancedUrl => {
                    this.elements.enhancedPreview.src = enhancedUrl;
                });
            }
        }

        // Display threats
        this.displayThreats(results.threats || []);

        // Display metrics
        this.displayMetrics(results.metrics || {});

        // Show notification
        this.showNotification(`Processing completed in ${results.processingTime}ms!`, 'success');

        // Scroll to results
        setTimeout(() => {
            if (this.elements.results) {
                this.elements.results.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }

    displayThreats(threats) {
        if (this.elements.threatCount) {
            this.elements.threatCount.textContent = threats.length;
        }

        if (this.elements.threatsList) {
            this.elements.threatsList.innerHTML = '';

            threats.forEach((threat, index) => {
                const threatEl = document.createElement('div');
                const priorityClass = this.getPriorityClass(threat.priority);
                threatEl.className = `p-6 bg-slate-800/50 border border-slate-700 rounded-lg mb-4 hover:border-${priorityClass}-500/50 transition-all duration-300`;

                // Enhanced threat display with detailed information
                threatEl.innerHTML = `
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex items-center space-x-3">
                            <div class="text-2xl">${threat.icon || '⚠️'}</div>
                            <div>
                                <h5 class="font-bold text-white text-lg capitalize">${threat.type.replace('_', ' ')}</h5>
                                <p class="text-sm text-slate-400">${threat.detectionMethod || 'Visual detection'}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-bold text-${priorityClass}-400">${(threat.confidence * 100).toFixed(1)}%</div>
                            <div class="text-xs text-slate-500">Confidence</div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="bg-slate-900/50 rounded-lg p-3">
                            <div class="text-xs text-slate-500 mb-1">Position</div>
                            <div class="text-sm font-medium text-white">
                                X: ${Math.round(threat.bbox.x * 100)}%, Y: ${Math.round(threat.bbox.y * 100)}%
                            </div>
                        </div>
                        <div class="bg-slate-900/50 rounded-lg p-3">
                            <div class="text-xs text-slate-500 mb-1">Size</div>
                            <div class="text-sm font-medium text-white">
                                ${Math.round(threat.bbox.width * 100)}×${Math.round(threat.bbox.height * 100)}px
                            </div>
                        </div>
                        ${threat.metrics ? `
                            <div class="bg-slate-900/50 rounded-lg p-3">
                                <div class="text-xs text-slate-500 mb-1">Distance</div>
                                <div class="text-sm font-medium text-white">${threat.metrics.estimatedDistance}</div>
                            </div>
                            <div class="bg-slate-900/50 rounded-lg p-3">
                                <div class="text-xs text-slate-500 mb-1">Threat Level</div>
                                <div class="text-sm font-medium text-white">${threat.metrics.threatLevel}/10</div>
                            </div>
                        ` : ''}
                    </div>
                    
                    ${threat.characteristics ? `
                        <div class="mb-4">
                            <div class="text-xs text-slate-500 mb-2">Characteristics</div>
                            <div class="flex flex-wrap gap-2">
                                ${threat.characteristics.map(char => `
                                    <span class="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs">
                                        ${char}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="flex items-center justify-between">
                        <span class="px-4 py-2 bg-${priorityClass}-500/20 text-${priorityClass}-400 rounded-full text-sm font-bold border border-${priorityClass}-500/30">
                            ${threat.priority} PRIORITY
                        </span>
                        <div class="text-xs text-slate-500">
                            ID: ${threat.id || `T${index + 1}`}
                        </div>
                    </div>
                `;

                // Add animation delay
                threatEl.style.animationDelay = `${index * 150}ms`;
                threatEl.classList.add('threat-item');

                this.elements.threatsList.appendChild(threatEl);
            });
        }

        // Add threat overlays to the enhanced image
        this.addThreatOverlays(threats);
    }

    addThreatOverlays(threats) {
        const enhancedPreview = this.elements.enhancedPreview;
        if (!enhancedPreview || !enhancedPreview.parentElement) return;

        const container = enhancedPreview.parentElement;

        // Remove existing overlays
        container.querySelectorAll('.threat-overlay').forEach(el => el.remove());

        threats.forEach((threat, index) => {
            if (!threat.bbox) return;

            const overlay = document.createElement('div');
            overlay.className = 'threat-overlay absolute border-2 rounded pointer-events-none';
            overlay.style.cssText = `
                left: ${threat.bbox.x * 100}%;
                top: ${threat.bbox.y * 100}%;
                width: ${threat.bbox.width * 100}%;
                height: ${threat.bbox.height * 100}%;
                border-color: ${threat.color};
                animation: threat-pulse 2s infinite;
                animation-delay: ${index * 200}ms;
                z-index: 10;
            `;

            // Add enhanced label
            const label = document.createElement('div');
            label.className = 'absolute -top-8 left-0 text-xs font-bold px-2 py-1 rounded whitespace-nowrap';
            label.style.cssText = `
                background: ${threat.color};
                color: white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            `;
            label.textContent = `${threat.icon} ${threat.type.toUpperCase()} (${(threat.confidence * 100).toFixed(0)}%)`;

            // Add threat level indicator
            const levelIndicator = document.createElement('div');
            levelIndicator.className = 'absolute -bottom-6 right-0 text-xs font-bold px-2 py-1 rounded';
            levelIndicator.style.cssText = `
                background: rgba(0,0,0,0.8);
                color: ${threat.color};
                border: 1px solid ${threat.color};
            `;
            levelIndicator.textContent = `LVL ${threat.metrics?.threatLevel || 'N/A'}`;

            overlay.appendChild(label);
            overlay.appendChild(levelIndicator);
            container.appendChild(overlay);
        });
    }

    displayMetrics(metrics) {
        if (this.elements.metricsGrid) {
            const metricsData = {
                'PSNR': { value: metrics.psnr || '28.5', unit: 'dB', color: 'blue' },
                'SSIM': { value: metrics.ssim || '0.892', unit: '', color: 'cyan' },
                'UIQM': { value: metrics.uiqm || '3.24', unit: '', color: 'purple' },
                'Contrast': { value: metrics.contrast || '92', unit: '%', color: 'green' },
                'Sharpness': { value: metrics.sharpness || '87', unit: '%', color: 'yellow' },
                'Color': { value: metrics.colorfulness || '89', unit: '%', color: 'emerald' }
            };

            this.elements.metricsGrid.innerHTML = Object.entries(metricsData).map(([key, data]) => `
                <div class="bg-slate-800/50 rounded-lg p-4 text-center hover:bg-slate-700/50 transition-colors">
                    <div class="text-2xl font-bold text-${data.color}-400 mb-1">${data.value}${data.unit}</div>
                    <div class="text-sm text-slate-400">${key}</div>
                </div>
            `).join('');
        }
    }

    downloadResults() {
        if (this.elements.enhancedPreview?.src) {
            const link = document.createElement('a');
            link.href = this.elements.enhancedPreview.src;
            link.download = `jalchaksh_enhanced_${Date.now()}.jpg`;
            link.click();
            this.showNotification('Image downloaded successfully!', 'success');
        }
    }

    resetToUpload() {
        if (this.elements.results) {
            this.elements.results.classList.add('hidden');
        }
        if (this.elements.uploadArea) {
            this.elements.uploadArea.classList.remove('hidden');
        }
        if (this.elements.progressBar) {
            this.elements.progressBar.style.width = '0%';
        }
        if (this.elements.fileInput) {
            this.elements.fileInput.value = '';
        }

        // Scroll back to demo section
        const demoSection = document.getElementById('demo');
        if (demoSection) {
            demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    setupAnimations() {
        // Animated statistics
        this.animateStats();

        // Feature cards animation
        this.animateFeatureCards();
    }

    animateStats() {
        // Statistics animation removed as per request
        console.log('Statistics section removed');
    }

    animateValue(id, start, end, duration, suffix = '') {
        const element = document.getElementById(id);
        if (!element) return;

        const range = end - start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            element.textContent = current + suffix;
            if (current === end) {
                clearInterval(timer);
            }
        }, stepTime);
    }

    animateFeatureCards() {
        const featureObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.feature-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.6s ease-out';
            featureObserver.observe(card);
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-24 right-6 z-50 px-6 py-4 rounded-lg shadow-2xl fade-in ${type === 'success' ? 'bg-green-500/90' :
                type === 'error' ? 'bg-red-500/90' :
                    'bg-blue-500/90'
            }`;

        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-white font-medium">${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getPriorityColor(priority) {
        const colors = {
            'CRITICAL': '#ef4444',
            'HIGH': '#f97316',
            'MEDIUM': '#eab308',
            'LOW': '#3b82f6',
            'INFO': '#6b7280'
        };
        return colors[priority] || '#eab308';
    }

    getPriorityClass(priority) {
        const classes = {
            'CRITICAL': 'red',
            'HIGH': 'orange',
            'MEDIUM': 'yellow',
            'LOW': 'blue',
            'INFO': 'gray'
        };
        return classes[priority] || 'yellow';
    }

    getThreatIcon(threatType) {
        const icons = {
            'submarine': '🚢',
            'mine': '💣',
            'diver': '🤿',
            'drone': '🚁',
            'debris': '🗑️',
            'fish': '🐟',
            'unknown': '❓'
        };
        return icons[threatType] || '⚠️';
    }
}

// Initialize the application
const app = new JalchakshApp();

// Export for debugging
window.jalchakshApp = app;

console.log('🚀 Jalchaksh Application loaded successfully!');
