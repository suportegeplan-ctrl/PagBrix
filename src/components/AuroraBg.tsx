/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export default function AuroraBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Mesh Spots */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] sm:w-[45vw] sm:h-[45vw] rounded-full bg-[#873D48] opacity-35 blur-[100px] sm:blur-[130px] animate-aurora-glow-1" 
        style={{ animationDuration: '24s' }}
      />
      <div 
        className="absolute top-[20%] right-[-10%] w-[55vw] h-[55vw] sm:w-[40vw] sm:h-[40vw] rounded-full bg-[#DC758F] opacity-30 blur-[120px] sm:blur-[150px] animate-aurora-glow-2" 
        style={{ animationDuration: '28s' }}
      />
      <div 
        className="absolute bottom-[-10%] left-[10%] w-[65vw] h-[65vw] sm:w-[50vw] sm:h-[50vw] rounded-full bg-[#00FFCD] opacity-[0.18] blur-[90px] sm:blur-[120px] animate-aurora-glow-3" 
        style={{ animationDuration: '22s' }}
      />
      <div 
        className="absolute bottom-[30%] right-[20%] w-[50vw] h-[50vw] sm:w-[35vw] sm:h-[35vw] rounded-full bg-[#E3D3E4] opacity-50 blur-[110px] sm:blur-[140px] animate-aurora-glow-1" 
        style={{ animationDuration: '32s' }}
      />
    </div>
  );
}
