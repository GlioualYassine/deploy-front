"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import axiosInstance from "@/lib/axiosInstance";
import { id } from "date-fns/locale";

const Profile = () => {
  const [user, setUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Récupérer les données utilisateur depuis le localStorage
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  const validatePassword = (password:any) => {
    if (password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères.";
    }
    return "";
  };

  const validateConfirmPassword = (password:string, confirmPassword:string) => {
    if (confirmPassword && password !== confirmPassword) {
      return "Les mots de passe ne correspondent pas.";
    }
    return "";
  };

  const handlePasswordChange = (e:any) => {
    const newPassword = e.target.value;
    setUser({ ...user, password: newPassword });

    const passwordError = validatePassword(newPassword);
    const confirmPasswordError = validateConfirmPassword(newPassword, user.confirmPassword);

    setErrors({ password: passwordError, confirmPassword: confirmPasswordError });
  };

  const handleConfirmPasswordChange = (e:any) => {
    const newConfirmPassword = e.target.value;
    setUser({ ...user, confirmPassword: newConfirmPassword });

    const confirmPasswordError = validateConfirmPassword(user.password, newConfirmPassword);
    setErrors((prev) => ({ ...prev, confirmPassword: confirmPasswordError }));
  };

  const handleSubmit = async () => {
    // Vérification de l'absence d'erreurs
    if (!errors.password && !errors.confirmPassword) {
      try {
        // Envoi des données via axios (utilise l'endpoint approprié pour l'édition)
        const response = await axiosInstance.put("users/"+user.id, user); 

        if (response.status === 200) {
          // Mise à jour locale de l'utilisateur après une réponse réussie
          localStorage.setItem("user", JSON.stringify(response.data)); // Si l'API retourne les nouvelles données utilisateur
          setUser(response.data);

          alert("Les informations de l'utilisateur ont été mises à jour avec succès.");
        } else {
          alert("Une erreur est survenue lors de la mise à jour.");
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour des données:", error);
        alert("Impossible de mettre à jour. Veuillez réessayer.");
      }
    } else {
      alert("Veuillez corriger les erreurs avant de soumettre.");
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <Card className="w-[400px]">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>Mon Profil</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Prénom */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium">
                Prénom
              </label>
              <Input
                id="firstName"
                type="text"
                value={user.firstName}
                onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                className="mt-1"
                placeholder="Entrez votre prénom"
              />
            </div>

            {/* Nom */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium">
                Nom
              </label>
              <Input
                id="lastName"
                type="text"
                value={user.lastName}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                className="mt-1"
                placeholder="Entrez votre nom"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Adresse e-mail
              </label>
              <Input
                id="email"
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="mt-1"
                placeholder="Entrez votre adresse e-mail"
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Mot de passe
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={user.password}
                  onChange={handlePasswordChange}
                  className="mt-1"
                  placeholder="Entrez votre mot de passe"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
            </div>

            {/* Confirmation du mot de passe */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type="password"
                  value={user.confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="mt-1"
                  placeholder="Confirmer votre mot de passe"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <Button onClick={handleSubmit} className="mt-4">
              Sauvegarder les modifications
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
