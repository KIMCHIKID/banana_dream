// Basic setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a buffer geometry with many faces
const geometry = new THREE.IcosahedronBufferGeometry(5, 6); // 6 subdivisions to ensure 200+ faces

// Apply transformations to make it banana-shaped
const positionAttribute = geometry.attributes.position;
const vertex = new THREE.Vector3();
const color = new THREE.Color('#FFFCBE');
const colors = [];

for (let i = 0; i < positionAttribute.count; i++) {
    vertex.fromBufferAttribute(positionAttribute, i);

    // Lengthen the geometry
    vertex.y *= 3;

    // Apply a curve to the geometry
    const theta = (vertex.y + 15) / 30 * Math.PI; // Normalize y to [-1, 1] and scale to [0, pi]
    vertex.x += Math.sin(theta) * 3.5;
    vertex.z += Math.cos(theta) * 3.5;

    // Scale the ends differently
    if (vertex.y > 12) {
        const scale = (vertex.y - 12) / 12;
        vertex.multiplyScalar(1 - scale * 0.6);
    } else if (vertex.y < -12) {
        const scale = (-vertex.y - 12) / 12;
        vertex.multiplyScalar(1 - scale * 0.9); // Make the bottom end even narrower
    }

    positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);

    // Add the specified color to all vertices
    colors.push(color.r, color.g, color.b);
}

geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
geometry.attributes.position.needsUpdate = true;

const bananaMaterial = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors, wireframe: true });
const banana = new THREE.Mesh(geometry, bananaMaterial);
scene.add(banana);

camera.position.z = 40;

// Lighting for better visualization
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    banana.rotation.x += 0.01;
    banana.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});



// text

function Ticker( elem ) {
	elem.lettering();
	this.done = false;
	this.cycleCount = 9;
	this.cycleCurrent = 0;
	this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()-_=+{}|[]\\;\':"<>?,./`~'.split('');
	this.charsCount = this.chars.length;
	this.letters = elem.find( 'span' );
	this.letterCount = this.letters.length;
	this.letterCurrent = 0;

	this.letters.each( function() {
		var $this = $( this );
		$this.attr( 'data-orig', $this.text() );
		$this.text( '-' );
	});
}

Ticker.prototype.getChar = function() {
	return this.chars[ Math.floor( Math.random() * this.charsCount ) ];
};

Ticker.prototype.reset = function() {
	this.done = false;
	this.cycleCurrent = 0;
	this.letterCurrent = 0;
	this.letters.each( function() {
		var $this = $( this );
		$this.text( $this.attr( 'data-orig' ) );
		$this.removeClass( 'done' );
	});
	this.loop();
};

Ticker.prototype.loop = function() {
	var self = this;

	this.letters.each( function( index, elem ) {
		var $elem = $( elem );
		if( index >= self.letterCurrent ) {
			if( $elem.text() !== ' ' ) {
				$elem.text( self.getChar() );
				$elem.css( 'opacity', Math.random() );
			}
		}
	});

	if( this.cycleCurrent < this.cycleCount ) {
		this.cycleCurrent++;
	} else if( this.letterCurrent < this.letterCount ) {
		var currLetter = this.letters.eq( this.letterCurrent );
		this.cycleCurrent = 0;
		currLetter.text( currLetter.attr( 'data-orig' ) ).css( 'opacity', 1 ).addClass( 'done' );
		this.letterCurrent++;
	} else {
		this.done = true;
	}

	if( !this.done ) {
		requestAnimationFrame( function() {
			self.loop();
		});
	} else {
		// setTimeout( function() {
			// self.reset();
		// }, 3550 );
	}
};

$words = $( '.word' );

$words.each( function() {
	var $this = $( this ),
		ticker = new Ticker( $this ).reset();
	$this.data( 'ticker', ticker  );
});