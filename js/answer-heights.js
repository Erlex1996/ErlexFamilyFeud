function normalizeAnswerHeights(){
  const boxes = document.querySelectorAll('.answer-box');
  if(!boxes.length) return;

  boxes.forEach(box => {
    box.style.height = 'auto';
  });

  let maxHeight = 0;
  boxes.forEach(box => {
    const height = box.getBoundingClientRect().height;
    if(height > maxHeight) maxHeight = height;
  });

  const finalHeight = Math.ceil(maxHeight);
  boxes.forEach(box => {
    box.style.height = finalHeight + 'px';
  });
}

window.normalizeAnswerHeights = normalizeAnswerHeights;

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(normalizeAnswerHeights, 120);
});
