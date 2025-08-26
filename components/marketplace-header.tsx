/*
 * Copyright 2025, Orange Bricks
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Wrench, Menu, X, MessageCircle } from "lucide-react"
import { useState } from "react"

export function MarketplaceHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center space-x-2 md:space-x-8">
            <Link href="/" className="flex items-center space-x-2 md:space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                <Image 
                  src="/jupyter-marketplace-logo.png" 
                  alt="Jupyter Marketplace Logo" 
                  width={40} 
                  height={40} 
                  className="w-8 h-8 md:w-10 md:h-10"
                />
              </div>
              <div className="text-lg md:text-xl font-semibold">
                <span className="text-foreground">JupyterLab</span>
                <span className="text-muted-foreground mx-1 md:mx-2">|</span>
                <span className="text-primary">Marketplace</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link 
              href="/about" 
              className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <a
              href="https://github.com/orbrx/jupyter-marketplace/issues/new/choose"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center text-xs px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              Feedback
            </a>
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex text-xs md:text-sm px-3 md:px-4 py-2 md:py-2" 
              asChild
              title="Scaffold a JupyterLab extension with the official template (TypeScript + Python)."
            >
              <a 
                href="https://github.com/orbrx/extension-template-cursor?utm_source=jlmp&utm_medium=header_cta&utm_campaign=dev_onramp" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Wrench className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Create an Extension</span>
                <span className="sm:hidden">Create</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile dropdown menu */}
      {isMenuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-border bg-card">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <Link 
                href="/about" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <a
                href="https://github.com/orbrx/jupyter-marketplace/issues/new/choose"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Feedback
              </a>
              <a 
                href="https://github.com/orbrx/extension-template-cursor?utm_source=jlmp&utm_medium=header_cta&utm_campaign=dev_onramp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Wrench className="w-4 h-4 mr-2" />
                Create an Extension
              </a>
              {/* Future menu items can be added here */}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
